import * as _ from 'lodash';
import {AbstractInstanceFactory, DiagramModel, LinkModel, NodeModel, PortModel} from 'storm-react-diagrams';
import {PintuInputPortModel} from './PintuInputPortModel';
import {PintuActionPortModel} from './PintuActionPortModel';
import {PintuEntrancePortModel} from './PintuEntrancePortModel';
import {IStepConfig, IActionsDeclaration} from '../../../lib/interfaces';
import {preparePayloadDeclarationSerialize, deSerializePayloadDeclaration} from '../../../lib/types';
import {IContainerSpec} from '../../../lib/ContainerRegistry';

export class PintuNodeModel extends NodeModel {
  private _config: IStepConfig;
  get config(): IStepConfig {
    return this._config;
  }

  private _container: IContainerSpec;
  get container(): IContainerSpec {
    return this._container;
  }

  constructor(config?: IStepConfig, container?: IContainerSpec) {
    super('pintuNode');
    if (config && container) {
      this.setData(config, container);
    }
  }

  setData(config: IStepConfig, container: IContainerSpec) {
    this._config = config;
    this._container = container;
    this.addPort(new PintuEntrancePortModel());
    _.forEach(container.inputs, (type, name: string) => {
      this.addPort(new PintuInputPortModel(name, type));
    });

    _.forEach(container.actions, (action, name: string) => {
      this.addPort(new PintuActionPortModel(action));
    });
  }

  getContainerForSerialize() {
    const {
      inputs,
      actions,
      ...others,
    } = this._container;

    const serializedInputs = preparePayloadDeclarationSerialize(inputs);
    const serializedActions = _.mapValues(actions, (action) => {
      return {
        ...action,
        payload: preparePayloadDeclarationSerialize(action.payload),
      };
    });
    return {
      ...others,
      inputs: serializedInputs,
      actions: serializedActions,
    };
  }

  serialize() {
    return {
      ...super.serialize(),
      config: this._config,
      container: this.getContainerForSerialize(),
    }
  }

  deSerialize(data: any) {
    super.deSerialize(data);
    this._config = data.config;

    const inputs = deSerializePayloadDeclaration(data.container.inputs);
    if (!inputs) {
      throw new TypeError(
        `Invalid serialized container inputs for node ${data.container.name}`,
      );
    }

    const actionPayloads = _.mapValues(data.container.actions, (action) => {
      return deSerializePayloadDeclaration(action.payload);
    });
    const actions: IActionsDeclaration = {};
    _.forEach(actionPayloads, (payload, name: string) => {
      if (!payload) {
        throw new TypeError(
          `Invalid serialized payload for `
          + `node ${data.continer.name} action ${name}`,
        );
      }
      actions[name] = {
        ...data.container.actions[name],
        payload,
      };
    });
    this._container = {
      name: data.container.name,
      pathTemplate: data.container.pathTemplate,
      inputs,
      actions,
    };
    // Do not call setData because port deserialization is done by the engine.
  }

  getName(): string {
    return this._config.containerName;
  }

  private getPortModelsByType<TPortModel>(
    clazz: new (...args: Array<any>) => TPortModel
  ): Array<TPortModel> {
    const ports = this.getPorts();
    return Object.keys(ports).map((portName) => {
      const port = ports[portName];
      if (port instanceof clazz) {
        return port;
      }
      return null;
    }).filter(Boolean) as Array<TPortModel>;
  }

  getEntrancePortModel(): PintuEntrancePortModel {
    return this.getPortModelsByType(PintuEntrancePortModel)[0];
  }

  getInputPortModels(): Array<PintuInputPortModel> {
    return this.getPortModelsByType(PintuInputPortModel);
  }

  getActionPortModels(): Array<PintuActionPortModel> {
    return this.getPortModelsByType(PintuActionPortModel);
  }

  getActionPortWithName(actionName: string): PintuActionPortModel | undefined {
    const actionPortModels = this.getActionPortModels();
    return actionPortModels.find((portModel) => {
      return portModel.action.name === actionName;
    });
  }

  /**
   * Try to connect this node to the destNode from the action with actionName.
   * This operation will only succeed if, in the data model, the action is
   * configured to lead to destNode.
   * 
   * Now it only supports connections within the same flow.
   * 
   * @returns  true if successfully created a link and added to the model
   *           false otherwise
   */
  tryRestoreLink(
    actionName: string, 
    destNode: PintuNodeModel,
    targetModel: DiagramModel
  ): boolean {
    const destConfig = this.config.destinations[actionName];
    if (!destConfig) {
      throw new TypeError(
        `Action config (${actionName}) not found in `
        + `step (${this.container.name}).`,
      );
    }

    if (destConfig.type === 'step' && destConfig.stepID === destNode.id) {
      // TODO Only support in-flow connection for now, implement in future
      const srcActionPort = this.getActionPortWithName(actionName);
      if (!srcActionPort) {
        throw new TypeError(
          `Action ${actionName} not found in ` 
          + `container ${this.container.name}`,
        );
      }
      srcActionPort.clearLinks();
      const destEntrance = destNode.getEntrancePortModel();
      const newLink = new LinkModel();
      newLink.setSourcePort(srcActionPort);
      newLink.setTargetPort(destEntrance);
      targetModel.addLink(newLink);
      return true;
    }
    return false;
  }
}

export class PintuNodeInstanceFactory extends AbstractInstanceFactory<PintuNodeModel>{
	
	constructor(){
		super("PintuNodeModel");
	}
	
	getInstance(){
		return new PintuNodeModel();
	}
}
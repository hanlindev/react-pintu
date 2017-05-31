import * as _ from 'lodash';
import {AbstractInstanceFactory, DiagramModel, LinkModel, NodeModel as SRDNodeModel, PortModel, BaseModelListener} from 'storm-react-diagrams';
import {InputPortModel} from './InputPortModel';
import {ActionPortModel} from './ActionPortModel';
import {EntrancePortModel} from './EntrancePortModel';
import {OutputPortModel} from './OutputPortModel';
import {IStepConfig, IActionsDeclaration, IContainerSpec, TypeCheckerFactory} from '../../../lib/interfaces';
import {preparePayloadDeclarationSerialize, deSerializePayloadDeclaration} from '../../../lib/types';

export interface INodeModelListeners extends BaseModelListener {
  nodeConfigChanged?: (node: NodeModel, newConfig: IStepConfig) => any;
}

export class NodeModel extends SRDNodeModel {
  private _config: IStepConfig;
  get config(): IStepConfig {
    return this._config;
  }

  private _container: IContainerSpec;
  get container(): IContainerSpec {
    return this._container;
  }

  constructor(config?: IStepConfig, container?: IContainerSpec) {
    super('Node');
    if (config && container) {
      this.setData(config, container);
    }
  }

  addListener(listeners: INodeModelListeners) {
    return super.addListener(listeners);
  }

  /**
   * DO NOT call this method in IDiagramChange's accept method. You should 
   * directly assign the new config to the node and return the config as changed
   * step config map.
   */
  setConfig(config: IStepConfig) {
    // Basic validation: the container name can't be changed.
    if (config.containerName !== this.container.name) {
      throw new TypeError("Unable to change existing config's container name");
    }
    this._config = config;
    this.iterateListeners((listener) => {
      const {nodeConfigChanged} = listener;
      nodeConfigChanged && nodeConfigChanged(this, config);
    });
  }

  iterateListeners(cb: (listeners: INodeModelListeners) => any) {
    super.iterateListeners(cb);
  }

  setData(config: IStepConfig, container: IContainerSpec) {
    this._config = config;
    this._container = container;
    this.addPort(new EntrancePortModel());
    _.forEach(container.inputs, (type, name: string) => {
      this.addPort(new InputPortModel(name, type));
    });

    _.forEach(container.actions, (action, name: string) => {
      this.addPort(new ActionPortModel(action));
    });
  }

  // groupID identifies a group of output ports. They are usually grouped by
  // actions.
  addOutputPort(name: string, type: TypeCheckerFactory, groupID?: string) {
    const outputPorts = this.getOutputPortModels();
    const existing = outputPorts.find((model) => {
      return (
        model.groupID === groupID
        && model.argName === name
      );
    });
    if (!existing) {
      this.addPort(new OutputPortModel(name, type, groupID));
    }
  }

  clearOutputPorts(groupID?: string) {
    const outputPorts = this.getOutputPortModels().filter((port) => {
      return !groupID || port.groupID === groupID;
    });
    outputPorts.forEach((port) => {
      this.removePort(port);
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
      if (port instanceof clazz && port.constructor.name === clazz.name) {
        return port;
      }
      return null;
    }).filter(Boolean) as Array<TPortModel>;
  }

  getEntrancePortModel(): EntrancePortModel {
    return this.getPortModelsByType(EntrancePortModel)[0];
  }

  getInputPortModels(): Array<InputPortModel> {
    return this.getPortModelsByType(InputPortModel);
  }

  getActionPortModels(): Array<ActionPortModel> {
    return this.getPortModelsByType(ActionPortModel);
  }

  getActionPortWithID(actionID: string): ActionPortModel | undefined {
    const actionPortModels = this.getActionPortModels();
    return actionPortModels.find((portModel) => {
      return portModel.action.id === actionID;
    });
  }
  
  getOutputPortModels(): Array<OutputPortModel> {
    return this.getPortModelsByType(OutputPortModel);
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
    actionId: string, 
    destNode: NodeModel,
    targetModel: DiagramModel
  ): boolean {
    const destConfig = this.config.destinations[actionId];
    if (!destConfig) {
      throw new TypeError(
        `Action config (${actionId}) not found in `
        + `step (${this.container.name}).`,
      );
    }

    if (destConfig.type === 'step' && destConfig.stepID === destNode.id) {
      // TODO Only support in-flow connection for now, implement out-flow 
      // in future
      const srcActionPort = this.getActionPortWithID(actionId);
      if (!srcActionPort) {
        throw new TypeError(
          `Action ${actionId} not found in ` 
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

export class NodeInstanceFactory extends AbstractInstanceFactory<NodeModel>{
	constructor(){
		super("NodeModel");
	}
	
	getInstance(){
		return new NodeModel();
	}
}
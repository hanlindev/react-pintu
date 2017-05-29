import * as _ from 'lodash';
import {LinkModel} from 'storm-react-diagrams';
import {IDiagramChange, IFlowEngine} from '../interfaces';
import {IStepConfigMapChange, ISourceSpec} from '../../interfaces';
import {ActionPayloadMultiplexer} from '../../containers'
import {ActionPortModel, NodeModel, OutputPortModel} from '../../../components/ui/diagrams';

export class NodeSourceRemoved implements IDiagramChange {
  private _sourcePort: ActionPortModel | OutputPortModel | null = null;
  get sourcePort(): ActionPortModel {
    return this._sourcePort as ActionPortModel;
  }

  private invalidReason: string | null = null;

  constructor(
    readonly node: NodeModel,
    readonly link: LinkModel,
  ) {
    this._sourcePort = link.getSourcePort() as ActionPortModel;
  }

  validate(engine: IFlowEngine): boolean {
    try {
      engine.getNodeRef(this.node.config.id);
    } catch (e) {
      return false;
    }

    if (!(
      this._sourcePort instanceof ActionPortModel
      || this._sourcePort instanceof OutputPortModel
    )) {
      this.invalidReason = 'Source is not an action';
      return false;
    }
    return true;
  }

  getInvalidReason() {
    return this.invalidReason;
  }

  accept(engine: IFlowEngine): IStepConfigMapChange {
    if (engine.hasNode(this.sourcePort)) {
      const srcNode = engine.getNodeRef(this.sourcePort);
      const srcSpec: ISourceSpec = {
        linkID: this.link.getID(),
        stepID: srcNode.config.id,
        containerName: srcNode.config.containerName,
        actionID: this.sourcePort.action.id,
      }

      _.remove(this.node.config.sources, (source) => {
        return _.isEqual(source, srcSpec);
      });
      const thisContainer = engine.getContainer(this.node.config.containerName);
      if (thisContainer instanceof ActionPayloadMultiplexer) {
        this.node.clearOutputPorts(this.link.getID());
      }

      return {
        [this.node.config.id]: this.node.config,
      };
    }

    this.deleteInvalidSources(engine);
    this.deleteInvalidInputSources(engine);

    return {
      [this.node.config.id]: this.node.config,
    };
  }

  private deleteInvalidSources(engine: IFlowEngine) {
    // Node removal will cause this event to have no source node. Find all srcSpec
    // whose stepID lease to null node.
    const sources = this.node.config.sources;
    const removedSources = sources.filter((source) => {
      return !engine.hasNode(source.stepID);
    });
    removedSources.forEach((source) => {
      _.remove(sources, (src) => _.isEqual(src, source));
    });
    this.node.config.sources = sources;
  }

  private deleteInvalidInputSources(engine: IFlowEngine) {
    const inputSources = this.node.config.inputSources;
    const removedKeys = Object.keys(inputSources).filter((inputName) => {
      const source = inputSources[inputName];
      switch (source.type) {
        case 'actionPayload':
          return !engine.hasNode(source.stepID);
        case 'constant':
        default:
          return false;
      }
    });
    removedKeys.forEach((key) => {
      delete inputSources[key];
    });
    this.node.config.inputSources = inputSources;
  }

  reject(engine: IFlowEngine) {

  }
}
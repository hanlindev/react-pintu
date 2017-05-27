import * as _ from 'lodash';
import {LinkModel} from 'storm-react-diagrams';
import {IDiagramChange, IFlowEngine} from '../interfaces';
import {IStepConfigMapChange, ISourceSpec} from '../../interfaces';
import {ActionPayloadMultiplexer} from '../../containers'
import {ActionPortModel, NodeModel} from '../../../components/ui/diagrams';

export class NodeSourceRemoved implements IDiagramChange {
  private _sourcePort: ActionPortModel | null = null;
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
    if (!(this._sourcePort instanceof ActionPortModel)) {
      this.invalidReason = 'Source is not an action';
      return false;
    }
    return true;
  }

  getInvalidReason() {
    return this.invalidReason;
  }

  accept(engine: IFlowEngine): IStepConfigMapChange {
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

  reject(engine: IFlowEngine) {

  }
}
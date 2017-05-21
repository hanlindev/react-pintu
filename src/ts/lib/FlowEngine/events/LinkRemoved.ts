import {LinkModel} from 'storm-react-diagrams';
import {IStepConfigMap} from '../../interfaces/flow';
import {IDiagramChange, IFlowEngine} from '../interfaces';
import {PintuActionPortModel} from '../../../components/ui/diagrams';

/**
 * Accept:
 * The source node's action's destination wll be deleted.
 * 
 * Reject:
 * The link will be restored.
 */
export class LinkRemoved implements IDiagramChange {
  constructor(readonly link: LinkModel) {}

  isValid(engine: IFlowEngine): boolean {
    // For now, link removal is always valid
    return true;
  }

  accept(engine: IFlowEngine): IStepConfigMap {
    const result: IStepConfigMap = {}
    const sourcePort = this.link.getSourcePort() as PintuActionPortModel;
    if (sourcePort) {
      const node = engine.getNodeRef(sourcePort);
      delete node.config.destinations[sourcePort.action.id];
      result[node.config.id] = node.config;
    }
    return result;
  }

  reject(engine: IFlowEngine) {
    engine.getDiagramModel().addLink(this.link);
  }
}
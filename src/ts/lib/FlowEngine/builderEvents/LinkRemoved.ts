import {LinkModel, PortModel} from 'storm-react-diagrams';
import {IStepConfigMap} from '../../interfaces/flow';
import {IDiagramChange, IFlowEngine} from '../interfaces';
import {ActionPortModel, EntrancePortModel, InputPortModel, NodeModel, OutputPortModel} from '../../../components/ui/diagrams';
/**
 * Accept:
 * The source node's action's destination wll be deleted.
 * 
 * Reject:
 * The link will be restored.
 */
export class LinkRemoved implements IDiagramChange {
  constructor(readonly link: LinkModel) {}

  validate(engine: IFlowEngine): boolean {
    return true;
  }

  getInvalidReason() {
    return null;
  }

  accept(engine: IFlowEngine): IStepConfigMap {
    const result: IStepConfigMap = {}
    const sourcePort = this.link.getSourcePort() as ActionPortModel;
    if (sourcePort instanceof ActionPortModel && engine.hasNode(sourcePort)) {
      const node = engine.getNodeRef(sourcePort);
      delete node.config.destinations[sourcePort.action.id];
      result[node.config.id] = node.config;
    }

    const targetPort = this.link.getTargetPort();
    if (targetPort instanceof InputPortModel && engine.hasNode(targetPort)) {
      const node = engine.getNodeRef(targetPort);
      if (this.shouldDeleteInputSource(
        engine,
        node,
        sourcePort,
        targetPort,
      )) {
        delete node.config.inputSources[targetPort.argName];
      }
      result[node.config.id] = node.config;
    }

    return result;
  }

  shouldDeleteInputSource(
    engine: IFlowEngine,
    targetNode: NodeModel, 
    output: PortModel | null, 
    input: InputPortModel,
  ): boolean {
    if (!(output instanceof OutputPortModel)) {
      return false;
    }
    const srcNode = engine.getNodeRef(output);
    if (!srcNode) {
      return false;
    }

    const existingSource = targetNode.config.inputSources[input.argName];
    if (existingSource) {
      return (
        existingSource.type === 'actionPayload' 
        && existingSource.stepID === srcNode.config.id
      );
    }

    return false;
  }

  reject(engine: IFlowEngine) {
    engine.getDiagramModel().addLink(this.link);
  }
}
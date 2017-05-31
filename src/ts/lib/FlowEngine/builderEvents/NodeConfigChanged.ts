import {IDiagramChange, IFlowEngine} from '../interfaces';
import {IStepConfig, IStepConfigMapChange} from '../../interfaces';
import {NodeModel} from '../../../components/ui/diagrams';

/**
 * A simple pass through event that alter's the flow data structure.
 * The diagram change and validation has been done in the NodeModel
 * class so this is always valid.
 */
export class NodeConfigChanged implements IDiagramChange {
  constructor(
    readonly node: NodeModel,
    readonly config: IStepConfig
  ) {}

  validate() {
    return true;
  }

  getInvalidReason() {
    return null;
  }

  accept(engine: IFlowEngine): IStepConfigMapChange {
    return {
      [this.node.config.id]: this.config,
    };
  }

  reject(engine: IFlowEngine) {
    throw new TypeError('NodeConfigChanged event should never be rejected');
  }
}
import {NodeModel} from '../../../components/ui/diagrams';
import {IStepConfigMapChange} from '../../interfaces/flow';
import {IDiagramChange, IFlowEngine} from '../interfaces';

export class NodeRemoved implements IDiagramChange {
  constructor(
    readonly node: NodeModel,
  ) {}

  validate(engine: IFlowEngine): boolean {
    return true;
  }

  getInvalidReason() {
    return null;
  }

  accept(engine: IFlowEngine): IStepConfigMapChange {
    return {
      [this.node.config.id]: null,
    };
  }

  reject(engine: IFlowEngine) {
    throw new Error('Impossible action. All NodeRemoved changes are accepted');
  }
}
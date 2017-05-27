import {NodeModel} from '../../../components/ui/diagrams';
import {IStepConfigMap} from '../../interfaces/flow';
import {IDiagramChange, IFlowEngine} from '../interfaces';

export class NodeAdded implements IDiagramChange {
  constructor(
    readonly node: NodeModel,
  ) {}

  validate(engine: IFlowEngine): boolean {
    return true;
  }

  getInvalidReason() {
    return null;
  }

  accept(engine: IFlowEngine): IStepConfigMap {
    const {config} = this.node;
    return {
      [config.id]: config,
    };
  }

  reject(engine: IFlowEngine) {
    throw new Error('Impossible action. All NodeAdd changes are accepted');
  }
}
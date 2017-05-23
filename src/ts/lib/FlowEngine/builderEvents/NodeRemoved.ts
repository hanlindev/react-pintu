import {PintuNodeModel} from '../../../components/ui/diagrams';
import {IStepConfigMap} from '../../interfaces/flow';
import {IDiagramChange, IFlowEngine} from '../interfaces';

export class NodeRemoved implements IDiagramChange {
  constructor(
    readonly node: PintuNodeModel,
  ) {}

  isValid(engine: IFlowEngine): boolean {
    return false; // TODO
  }

  accept(engine: IFlowEngine): IStepConfigMap {
    // TODO
    console.log('Accept Node Removal');
    return {};
  }

  reject(engine: IFlowEngine) {
    // TODO
    console.log('Reject Node Removal');
  }
}
import {PintuNodeModel} from '../../../components/ui/diagrams';
import {IStepConfigMap} from '../../interfaces/flow';
import {IDiagramChange, IFlowEngine} from '../interfaces';

export class NodeAdded implements IDiagramChange {
  constructor(
    readonly node: PintuNodeModel,
  ) {}

  isValid(engine: IFlowEngine): boolean {
    // TODO
    return false;
  }

  accept(engine: IFlowEngine): IStepConfigMap {
    // TODO
    console.log('Accept Node Add');
    return {};
  }

  reject(engine: IFlowEngine) {
    // TODO
    console.log('Reject Node Add!');
  }
}
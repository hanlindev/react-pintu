import {DiagramEngine} from 'storm-react-diagrams';
import {BaseTrigger} from './BaseTrigger';
import {NodeModel} from '../../../components/ui/diagrams/NodeModel';
import {IStepConfig} from '../../interfaces';

export class ChangeNodeConfigField<TK extends keyof IStepConfig> extends BaseTrigger {
  constructor(
    readonly node: NodeModel,
    readonly name: TK,
    readonly value: IStepConfig[TK],
  ) {
    super();
  }

  trigger(engine: DiagramEngine) {
    super.trigger(engine);
    const {
      node,
      name,
      value,
    } = this;

    const config = node.config;
    config[name] = value;
    node.setConfig(config);
  }
}
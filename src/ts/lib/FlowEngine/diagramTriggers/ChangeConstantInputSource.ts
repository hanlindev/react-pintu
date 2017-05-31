import {DiagramEngine} from 'storm-react-diagrams';
import {BaseTrigger} from './BaseTrigger';
import {NodeModel} from '../../../components/ui/diagrams/NodeModel';
import {IConstantInputSource} from '../../interfaces';

export class ChangeConstantInputSource extends BaseTrigger {
  constructor(
    readonly node: NodeModel,
    readonly inputName: string,
    readonly sourceSpec: IConstantInputSource,
  ) {
    super();
  }

  trigger(engine: DiagramEngine) {
    super.trigger(engine);
    const {
      node,
      inputName,
      sourceSpec,
    } = this;

    const config = node.config;
    config.inputSources[inputName] = sourceSpec;
    node.setConfig(config);
  }
}
import {DiagramEngine} from 'storm-react-diagrams';
import {BaseTrigger} from './BaseTrigger';
import {NodeModel} from '../../../components/ui/diagrams/NodeModel';

export class RemoveNode extends BaseTrigger {
  constructor(
    readonly node: NodeModel,
  ) {
    super();
  }
  
  trigger(engine: DiagramEngine) {
    super.trigger(engine);
    const model = engine.getDiagramModel();
    model.removeNode(this.node);
    this.node.remove();
  }
}
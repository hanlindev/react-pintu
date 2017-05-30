import {DiagramEngine, NodeModel, LinkModel} from 'storm-react-diagrams';
import {BaseTrigger} from './BaseTrigger';

export class RemoveModel extends BaseTrigger {
  constructor(
    readonly model: NodeModel | LinkModel,
  ) {
    super();
  }
  
  trigger(engine: DiagramEngine) {
    super.trigger(engine);
    const {
      model,
    } = this;

    const diagramModel = engine.getDiagramModel();
    if (model instanceof NodeModel) {
      diagramModel.removeNode(model);
    } else {
      diagramModel.removeLink(model);
    }
    
    model.remove();
  }
}
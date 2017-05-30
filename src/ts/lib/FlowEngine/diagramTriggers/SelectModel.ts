import {DiagramEngine, BaseModel} from 'storm-react-diagrams';
import {BaseTrigger} from './BaseTrigger';

export class SelectModel extends BaseTrigger {
  constructor(
    readonly model: BaseModel<any>,
  ) {
    super();
  }

  trigger(engine: DiagramEngine) {
    super.trigger(engine);
    const model = engine.getDiagramModel();
    model.clearSelection();
    this.model.setSelected(true);
    this.model.iterateListeners((listener) => {
      const {
        selectionChanged,
      } = listener;
      selectionChanged && selectionChanged(this.model, true);
    });
  }
}
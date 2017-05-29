import {DiagramEngine} from 'storm-react-diagrams';
import {IDiagramTrigger} from '../interfaces';

export class BaseTrigger implements IDiagramTrigger {
  protected consumed: boolean = false;

  trigger(engine: DiagramEngine) {
    if (this.consumed) {
      throw new TypeError(
        'The AddNode SRD event has been consumed. Do not reuse triggers!',
      );
    }
    this.consumed = true;
  }
}
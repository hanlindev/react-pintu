import {PortModel} from 'storm-react-diagrams';
import {IAction} from '../../../lib';

export class PintuActionPortModel extends PortModel {
  constructor(private action: IAction) {
    super(action.name);
  }

  getLabel() {
    return this.action.name;
  }

  serialize() {
    // TODO serialize payload declaration
    return {
      ...super.serialize(),
      name: this.action.name,
      type: this.action.type,
    };
  }

  deSerialize(data: any) {
    super.deSerialize(data);
    this.action = {
      name: data.name,
      type: data.type,
      payload: {}, // TODO deserialize payload.
    }
  }
}
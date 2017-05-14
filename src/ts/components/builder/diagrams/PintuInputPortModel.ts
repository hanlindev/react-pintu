import {PortModel} from 'storm-react-diagrams';
import {ITypeChecker} from '../../../lib';

export class PintuInputPortModel extends PortModel {
  constructor(private inputName: string, private type: ITypeChecker) {
    super(inputName);
  }

  getLabel() {
    return this.inputName;
  }

  serialize() {
    return {
      ...super.serialize(),
      inputName: this.inputName,
      type: this.type.toString(),
    };
  }

  deSerialize(data: any) {
    super.deSerialize(data);
    this.inputName = data.inputName;
    // TODO deserialize TypeChecker
  }
}
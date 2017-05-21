import {AbstractInstanceFactory, PortModel} from 'storm-react-diagrams';
import {PintuBasePortModel} from './PintuBasePortModel';
import {ITypeChecker} from '../../../lib';

export class PintuEntrancePortModel extends PintuBasePortModel {
  public portType = 'entrance';
  constructor() {
    super('entrance');
  }

  getLabel() {
    return 'Enter';
  }

  serialize() {
    return {
      ...super.serialize(),
    };
  }

  deSerialize(data: any) {
    super.deSerialize(data);
  }
}

export class PintuEntrancePortFactory extends AbstractInstanceFactory<PintuEntrancePortModel> {
  constructor() {
    super('PintuEntrancePortModel');
  }

  getInstance(): PintuEntrancePortModel {
    return new PintuEntrancePortModel();
  }
}
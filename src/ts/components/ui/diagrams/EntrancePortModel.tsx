import {AbstractInstanceFactory, PortModel} from 'storm-react-diagrams';
import {BasePortModel} from './BasePortModel';
import {ITypeChecker} from '../../../lib';

export class EntrancePortModel extends BasePortModel {
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

export class EntrancePortFactory extends AbstractInstanceFactory<EntrancePortModel> {
  constructor() {
    super('EntrancePortModel');
  }

  getInstance(): EntrancePortModel {
    return new EntrancePortModel();
  }
}
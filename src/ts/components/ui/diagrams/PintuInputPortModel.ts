import {AbstractInstanceFactory, PortModel} from 'storm-react-diagrams';
import {TypeCheckerFactory} from '../../../lib/interfaces';
import {deSerializeTypeDeclaration} from '../../../lib/types';
import {PintuBasePortModel} from './PintuBasePortModel';

export class PintuInputPortModel extends PintuBasePortModel {
  private _inputName: string;
  get inputName(): string {
    return this._inputName;
  }

  private _type: TypeCheckerFactory;
  get type(): TypeCheckerFactory {
    return this._type;
  }

  public portType = 'input';

  constructor(inputName?: string, type?: TypeCheckerFactory) {
    super('input');
    if (inputName && type) {
      this.setData(inputName, type);
    }
  }

  setData(inputName: string, type: TypeCheckerFactory) {
    this.name = inputName;
    this._inputName = inputName;
    this._type = type;
  }

  getLabel() {
    return this._inputName;
  }

  serialize() {
    return {
      ...super.serialize(),
      inputName: this._inputName,
      typeImpl: this._type(),
    };
  }

  deSerialize(data: any) {
    super.deSerialize(data);
    const deSerializedType = deSerializeTypeDeclaration(data.typeImpl);
    if (!deSerializedType) {
      throw new TypeError(
        `Unrecognized type object for ${data.inputName}`,
      );
    }
    this.setData(data.inputName, deSerializedType);
  }
}

export class PintuInputPortFactory extends AbstractInstanceFactory<PintuInputPortModel> {
  constructor() {
    super('PintuInputPortModel');
  }

  getInstance() {
    return new PintuInputPortModel();
  }
}
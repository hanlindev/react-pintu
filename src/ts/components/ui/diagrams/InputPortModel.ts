import {AbstractInstanceFactory, PortModel} from 'storm-react-diagrams';
import {TypeCheckerFactory} from '../../../lib/interfaces';
import {deSerializeTypeDeclaration} from '../../../lib/types';
import {BasePortModel} from './BasePortModel';

export class InputPortModel extends BasePortModel {
  private _argName: string;
  get argName(): string {
    return this._argName;
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
    this._argName = inputName;
    this._type = type;
  }

  getLabel() {
    return this._argName;
  }

  serialize() {
    return {
      ...super.serialize(),
      inputName: this._argName,
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

export class InputPortFactory extends AbstractInstanceFactory<InputPortModel> {
  constructor() {
    super('InputPortModel');
  }

  getInstance() {
    return new InputPortModel();
  }
}
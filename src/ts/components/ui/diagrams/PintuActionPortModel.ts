import {AbstractInstanceFactory} from 'storm-react-diagrams';
import {PintuBasePortModel} from './PintuBasePortModel';
import {IAction} from '../../../lib/interfaces';
import {preparePayloadDeclarationSerialize, deSerializePayloadDeclaration} from '../../../lib/types';

export class PintuActionPortModel extends PintuBasePortModel {
  private _action: IAction;
  get action(): IAction {
    return this._action;
  }
  
  constructor(action?: IAction) {
    super('action', 'action');
    if (action) {
      this.setData(action);
    }
  }

  setData(action: IAction) {
    this.name = action.id;
    this._action = action;
  }

  getLabel() {
    return this._action.label;
  }

  serialize() {
    // TODO serialize payload declaration
    const {
      payload,
      ...others,
    } = this._action;
    const serializedAction = {
      ...others,
      payloadImpl: preparePayloadDeclarationSerialize(payload),
    };

    return {
      ...super.serialize(),
      serializedAction: serializedAction,
    };
  }

  deSerialize(data: any) {
    super.deSerialize(data);
    const payload = 
      deSerializePayloadDeclaration(data.serializedAction.payloadImpl);
    if (!payload) {
      throw new TypeError(
        `Invalid serialized payload declaration for ${data.name} action`,
      );
    }

    this.setData({
      id: data.id,
      label: data.label,
      type: data.type,
      payload,
    });
  }
}

export class PintuActionPortFactory extends AbstractInstanceFactory<PintuActionPortModel> {
  constructor() {
    super('PintuActionPortModel');
  }

  getInstance() {
    return new PintuActionPortModel();
  }
}
import {AbstractInstanceFactory} from 'storm-react-diagrams';
import {BasePortModel} from './BasePortModel';
import {IAction} from '../../../lib/interfaces';
import {preparePayloadDeclarationSerialize, deSerializePayloadDeclaration} from '../../../lib/types';

export class ActionPortModel extends BasePortModel {
  private _action: IAction;
  get action(): IAction {
    return this._action;
  }

  public portType = 'action';
  
  constructor(action?: IAction) {
    super('action');
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
    const {serializedAction} = data;
    const payload = 
      deSerializePayloadDeclaration(serializedAction.payloadImpl);
    if (!payload) {
      throw new TypeError(
        `Invalid serialized payload declaration for ${data.name} action`,
      );
    }

    this.setData({
      id: serializedAction.id,
      label: serializedAction.label,
      type: serializedAction.type,
      payload,
    });
  }
}

export class ActionPortFactory extends AbstractInstanceFactory<ActionPortModel> {
  constructor() {
    super('ActionPortModel');
  }

  getInstance() {
    return new ActionPortModel();
  }
}
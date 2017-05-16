import {TypeCheckerFactory} from './type';

export interface IPayloadDeclaration {
  [key: string]: TypeCheckerFactory;
}

export interface IInputsDeclaration extends IPayloadDeclaration {}

export interface IAction {
  name: string;
  type: 'intermediate' | 'endOfStep';
  payload: IPayloadDeclaration;
}

export interface IActionsDeclaration {
  [key: string]: IAction;
}

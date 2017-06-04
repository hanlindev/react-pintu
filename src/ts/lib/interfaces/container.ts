import {TypeCheckerFactory} from './type';

export interface IPayloadDeclaration {
  [key: string]: TypeCheckerFactory;
}

export interface IInputsDeclaration extends IPayloadDeclaration {}

export interface IAction {
  id: string;
  label: string;
  /**
   * endOfStep and replaceStep are the same except how URL is updated.
   * endOfStep pushes a new URL and replaceStep replaces the URL.
   */
  type: 'intermediate' | 'endOfStep' | 'replaceStep';
  payload: IPayloadDeclaration;
}

export interface IActionsDeclaration {
  [key: string]: IAction;
}

export interface IActionCallback {
  (actionID: string, payload: any): any;
}

export interface IContainerSpec {
  name: string;
  inputs: IInputsDeclaration;
  actions: IActionsDeclaration;
  pathTemplate: string;
}

export interface IContainerSpecMap {
  [key: string]: IContainerSpec;
}
import {IInputsDeclaration, IActionsDeclaration, IActionCallback} from './interfaces';
import {BaseContainer} from './BaseContainer';

export abstract class LogicContainer<T> extends BaseContainer {
  abstract run(inputs: any, onAction: IActionCallback): Promise<T>;
}
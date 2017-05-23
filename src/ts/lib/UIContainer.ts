import * as React from 'react';
import {IInputsDeclaration, IActionsDeclaration, IActionCallback} from './interfaces';
import {BaseContainer} from './BaseContainer';

export abstract class UIContainer extends BaseContainer {
  abstract render(
    inputs: IInputsDeclaration, 
    onAction: IActionCallback,
  ): JSX.Element;
}
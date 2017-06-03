import * as React from 'react';
import {IInputsDeclaration, IActionsDeclaration, IActionCallback} from './interfaces';
import {BaseContainer} from './BaseContainer';

export abstract class UIContainer extends BaseContainer {
  abstract render(
    inputs: IInputsDeclaration, 
    onAction: IActionCallback,
  ): JSX.Element;

  renderSample(): JSX.Element | null {
    // If you want to show some sample in the Pintu builder, return a sample
    // component with dummy data.
    return null;
  }
}
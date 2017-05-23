import * as React from 'react';
import {IPintuRunnerProps} from './props';
import {IContainerSpec, IActionCallback} from '../../lib/interfaces';
import {UIContainer} from '../../lib/UIContainer';

interface IUIRunnerProps extends IPintuRunnerProps {
  container: IContainerSpec;
  ui: UIContainer;
  inputs: any;
  onAction: IActionCallback;
}

export class UIRunner extends React.Component<IUIRunnerProps, void> {
  render(): JSX.Element {
    const {
      ui,
      inputs,
      onAction,
    } = this.props;
    return ui.render(inputs, onAction);
  }
}
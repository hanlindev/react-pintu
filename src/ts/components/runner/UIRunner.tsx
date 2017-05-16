import * as React from 'react';
import {IPintuRunnerProps} from './props';
import {IContainerSpec} from '../../lib';

interface IUIRunnerProps extends IPintuRunnerProps {
  container: IContainerSpec;
  component: React.ComponentClass<any>;
}

export class UIRunner extends React.Component<IUIRunnerProps, void> {
  render(): JSX.Element {
    return (
      <this.props.component />
    ); // TODO
  }
}
import * as React from 'react';
import {IPintuRunnerProps} from './props';
import {IContainerSpec} from '../../lib';

interface IUIContainerSpec extends IContainerSpec {
  component: React.ComponentClass<any>;
}

interface IUIRunnerProps extends IPintuRunnerProps {
  container: IUIContainerSpec;
}

export class UIRunner extends React.Component<IUIRunnerProps, void> {
  render(): JSX.Element {
    return (
      <this.props.container.component />
    ); // TODO
  }
}
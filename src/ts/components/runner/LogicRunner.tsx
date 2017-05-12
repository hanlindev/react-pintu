import * as React from 'react';
import {IPintuRunnerProps} from './props';
import {IContainerSpec} from '../../lib';

interface ILogicRunnerProps extends IPintuRunnerProps {
  container: IContainerSpec;
}

export class LogicRunner extends React.Component<ILogicRunnerProps, void> {
  render() {
    return (
      <div>
        TODO
      </div>
    );
  }
}
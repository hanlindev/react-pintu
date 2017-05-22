import * as React from 'react';
import {IPintuRunnerProps} from './props';
import {IContainerSpec, LogicContainer} from '../../lib';

interface ILogicRunnerProps extends IPintuRunnerProps {
  container: IContainerSpec;
  logic: LogicContainer<any>;
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
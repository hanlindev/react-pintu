import * as React from 'react';
import {IPintuRunnerProps} from './props';
import {IActionCallback, IContainerSpec, LogicContainer} from '../../lib';

interface ILogicRunnerProps extends IPintuRunnerProps {
  container: IContainerSpec;
  logic: LogicContainer<any>;
  inputs: any;
  onAction: IActionCallback;
}

export class LogicRunner extends React.Component<ILogicRunnerProps, void> {
  async componentDidMount() {
    const {
      logic,
      inputs,
      onAction,
    } = this.props;

    await logic.run(inputs, onAction);
  }

  render() {
    return (
      <div>
        TODO
      </div>
    );
  }
}
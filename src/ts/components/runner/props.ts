import {IContainerSpec, IActionCallback, IStepConfig} from '../../lib';

export interface IPintuRunnerProps {
  container: IContainerSpec;
  inputs: any;
  onAction: IActionCallback;
}
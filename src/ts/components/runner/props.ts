import {IStep} from '../../reducers/runner';
import {IContainerSpec, IActionCallback} from '../../lib';

export interface IPintuRunnerProps {
  query: any;
  inputs: any;
  step: IStep;
  onAction: IActionCallback;
}
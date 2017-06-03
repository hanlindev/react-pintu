import {IFlow} from './flow';
import {LocationShape} from 'react-router/lib/PropTypes';

export interface IActionPayload {
  [fieldName: string]: any;
}

export interface IActionPayloadMap {
  [actrionID: string]: IActionPayload;
}

export interface IStepPayloadMap {
  [stepID: string]: IActionPayloadMap;
}

export interface IURLLocation extends LocationShape {
  query: {
    [name: string]: any;
  };
}

export interface IURLParams {
  [name: string]: any;
}

export interface IRunnerEventHandlers {
  onRunnerLoadFlow(location: IURLLocation, params: IURLParams): Promise<IFlow>;
}
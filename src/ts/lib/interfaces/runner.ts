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

export interface IURLLocation {
  action: string;
  hash: string;
  key: string;
  pathname: string;
  query: {
    [name: string]: any;
  };
  search: string;
}

export interface IURLParams {
  [name: string]: any;
}

export interface IRunnerEventHandlers {
  onRunnerLoadFlow(location: IURLLocation, params: IURLParams): Promise<IFlow>;
  onGetStepID(
    location: IURLLocation, 
    params: IURLParams, 
    flow: IFlow,
  ): Promise<string>;
}
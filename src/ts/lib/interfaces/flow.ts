export type IActionDestination = 
{
  type: 'flow',
  flowID: string,
  stepID: string,
  sessionID?: string,
}
| {
  type: 'step',
  stepID: string,
}

export interface ILinkSource {
  stepID: string;
  actionID: string;
}

export interface IFlowMetaData {
  description: string;
  name: string;
}

export interface IStepConfig {
  id: string;
  // The name of the container in ContainerRegistry
  containerName: string;
  destinations: {[actionName: string]: IActionDestination};
}

export interface IStepConfigMap {
  [stepID: string]: IStepConfig;
}

export interface IFlow {
  id: string;
  metaData: IFlowMetaData;
  firstStepID: string;
  steps: {[key: string]: IStepConfig};
  serializedDiagram: string | null;
}
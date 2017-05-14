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

export interface IFlowMetaData {
  flowDescription: string;
  flowID: string;
  flowName: string;
}

export interface IStepConfig {
  id: string;
  // The name of the container in ContainerRegistry
  containerName: string;
  destinations: {[actionName: string]: IActionDestination};
}

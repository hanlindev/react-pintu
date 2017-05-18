import {IFlowMetaData, IFlow} from './flow';

export type DiagramChangeType = 
{
  type: 'link',
  srcStepID: string,
  actionID: string,
  destStepID: string,
};

export type FlowSaveResultType = 
{
  // The save operation will be performed after timeout.
  type: 'delay',
  timeout: number,
}
| {
  // The save operation failed. Message is mandatory.
  type: 'error',
  message: string,
}
| {
  // The save operation succeeded. If message is provided, a toast will
  // be displayed. Otherwise a subtle generic message will be shown.
  type: 'success',
  message?: string,
}

export interface IBuilderEventHandlers {
  // Given flow meta data, return a promise that resolves to the ID of the new
  // flow.
  onCreateFlow: (flowData: IFlowMetaData) => Promise<string>;
  // Given a flow ID, return a promise that resolves to the complete flow data.
  onLoadFlow: (flowID: string) => Promise<IFlow>;
  // Notify the app to auto-save the new flow. 
  onAutoSaveFlow: (newFlow: IFlow) => Promise<FlowSaveResultType>;
  // Notify the app of user-initiated flow save.
  onUserSaveFlow: (newFlow: IFlow) => Promise<FlowSaveResultType>;
}
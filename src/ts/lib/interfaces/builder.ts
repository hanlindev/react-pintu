import {IFlowMetaData, IFlow} from './flow';

export type FlowSaveResultType = 
{
  // The save operation will be performed after timeout.
  type: 'delay',
  timeout: number,
  onStartSaving: (cb: () => any) => any,
  onFinishSaving: (cb: (result: FlowSaveResultType) => any) => any,
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
  savedFlow: IFlow,
}

export type FlowDeleteResultType = {
  type: 'success',
}
| {
  type: 'error',
  reason: string,
}

export interface IFlowMetaDataMap {
  [flowID: string]: IFlowMetaData;
}

export interface IDefaultStepData {
  flowID?: string;
  stepID: string;
  [name: string]: any;
}

export type DeleteFlowCallbackType = (flowId: string) => Promise<FlowDeleteResultType>;
export type EditFlowCallbackType = <TK extends keyof IFlow> (
  flowID: string, 
  newFields: Pick<IFlow, TK>,
) => Promise<FlowSaveResultType>;
export type SaveFlowCallbackType = (flow: IFlow) => Promise<FlowSaveResultType>;

export interface IBuilderEventHandlers {
  // Given flow meta data, return a promise that resolves to the ID of the new
  // flow.
  onCreateFlow(flowData: IFlowMetaData): Promise<string>;
  onDeleteFlow: DeleteFlowCallbackType;
  // Given a flow ID, return a promise that resolves to the complete flow data.
  onLoadFlow(flowID: string): Promise<IFlow>;
  onEditFlow: EditFlowCallbackType;
  // Load a map of flowID -> flow meta data.
  onLoadFlowList(): Promise<IFlowMetaDataMap>;
  // Notify the app to auto-save the new flow. 
  onAutoSaveFlow: SaveFlowCallbackType;
  // Notify the app of user-initiated flow save.
  onUserSaveFlow: SaveFlowCallbackType;
}
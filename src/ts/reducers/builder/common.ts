import {IFlow, IStepConfig, IFlowMetaDataMap} from '../../lib/interfaces';
import {NodeModel} from '../../components/ui/diagrams/NodeModel';

export const CREATE_STEP = 'builder.createStep';
export const SET_FLOW = 'builder.setFlow';
export const SET_FLOW_LIST = 'builder.setFlowList';
export const SET_IS_SAVING_FLOW = 'builder.setIsSavingFlow';
export const RESTORE_FLOW = 'builder.restoreFlow';
export const SET_SERIALIZED_DIAGRAM = 'builder.setSerializedDiagram';
export const UPDATE_STEP_CONFIGS = 'builder.updateStepConfigs';
export const SET_SNACK_MESSAGE = 'builder.setSnackMessage';
export const SET_SELECTED_NODE = 'builder.setSelectedNode';

export type BuilderActionType =
{
  type: 'builder.setSerializedDiagram',
  serializedDiagram: string,
} 
| {
  type: 'builder.setIsSavingFlow',
  isSavingFlow: boolean,
}
| {
  type: 'builder.updateStepConfigs',
  stepConfigChanges: {[stepID: string]: IStepConfig},
}
| {
  type: 'builder.setSnackMessage',
  message: string | null,
}
| {
  type: 'builder.setSelectedNode',
  node: NodeModel | null,
}
| {
  type: 'builder.setFlowList',
  flowList: IFlowMetaDataMap,
}
| {
  type: 'builder.setFlow',
  newFlow: IFlow,
};
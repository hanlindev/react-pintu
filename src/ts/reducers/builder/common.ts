import {IFlow, IStepConfig} from '../../lib/interfaces';

export const CREATE_STEP = 'builder.createStep';
export const SET_FLOW = 'builder.setFlow';
export const RESTORE_FLOW = 'builder.restoreFlow';
export const SET_SERIALIZED_DIAGRAM = 'builder.setSerializedDiagram';
export const UPDATE_STEP_CONFIGS = 'builder.updateStepConfigs';

export type BuilderActionType =
{
  type: 'builder.setSerializedDiagram',
  serializedDiagram: string,
} | {
  type: 'builder.updateStepConfigs',
  stepConfigChanges: {[stepID: string]: IStepConfig},
}
| {
  type: 'builder.setFlow',
  newFlow: IFlow,
};
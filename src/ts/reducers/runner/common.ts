import * as Immutable from 'immutable';
import {IFlow, IStepPayloadMap, IStepConfig} from '../../lib/interfaces';

export const SET_FLOW = 'runner.setFlow';
export const SET_STEP_ID = 'runner.setStepID';
export const SET_STEP_PAYLOAD = 'runner.setStepPayload';
export const SET_SNACK_MESSAGE = 'runner.setSnackMessage';

export type RunnerActionType =
{
  type: 'runner.setFlow',
  flow: IFlow,
}
| {
  type: 'runner.setStepID',
  stepID: string,
}
| {
  type: 'runner.setSnackMessage',
  message: string | null,
}
| {
  type: 'runner.setStepPayload',
  stepID: string,
  actionID: string,
  payload: any,
}

const RunnerRecord = Immutable.Record({
  stepPayloads: Immutable.Map(),
  flow: null,
  stepID: null,
  snackMessage: null,
});

type ImmutableActionPayloadMap = Immutable.Map<string, Object>;
type ImmutableStepPayloadMap = Immutable.Map<string, ImmutableActionPayloadMap>;

export class RunnerState extends RunnerRecord {
  stepPayloads: ImmutableStepPayloadMap;
  flow: IFlow | null;
  stepID: string | null;
  snackMessage: string | null;

  setStepPayload(stepID: string, actionID: string, payloads: any) {
    return this.setIn(['stepPayloads', stepID, actionID], payloads);
  }

  getStepPayloadMap(): IStepPayloadMap {
    return this.stepPayloads.toJS();
  }

  setStepID(stepID: string) {
    return this.set('stepID', stepID);
  }

  setFlow(flow: IFlow) {
    return this.set('flow', flow);
  }

  getStepConfig(): IStepConfig | null {
    if (!this.flow || this.stepID === null) {
      return null;
    }
    return this.flow.steps[this.stepID];
  }

  setSnackMessage(message: string | null) {
    return this.set('snackMessage', message);
  }
}

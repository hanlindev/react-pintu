import {Dispatch} from 'react-redux';
import * as Immutable from 'immutable';
import {IStepPayloadMap, IStepConfig, IFlow} from '../lib/interfaces';

const RunnerRecord = Immutable.Record({
  stepPayloads: Immutable.Map(),
  flow: null,
  stepID: null,
});

type ImmutableActionPayloadMap = Immutable.Map<string, Object>;
type ImmutableStepPayloadMap = Immutable.Map<string, ImmutableActionPayloadMap>;

export class RunnerState extends RunnerRecord {
  stepPayloads: ImmutableStepPayloadMap;
  flow: IFlow | null;
  stepID: string | null;

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
}

const SET_FLOW = 'runner.setFlow';
const SET_STEP_ID = 'runner.setStepID';
const SET_STEP_PAYLOAD = 'runner.setStepPayload';

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
  type: 'runner.setStepPayload',
  stepID: string,
  actionID: string,
  payload: any,
}

export function runner(state: RunnerState, action: RunnerActionType) {
  if (!state) {
    state = new RunnerState();
  }

  switch (action.type) {
    case SET_FLOW:
      return state.setFlow(action.flow);
    case SET_STEP_ID:
      return state.setStepID(action.stepID);
    case SET_STEP_PAYLOAD:
      return state.setStepPayload(
        action.stepID,
        action.actionID,
        action.payload,
      );
  }

  return state;
}

export const actions = {
  setFlow(flow: IFlow): RunnerActionType {
    return {
      type: SET_FLOW,
      flow,
    };
  },

  setStepID(id: string): RunnerActionType {
    return {
      type: SET_STEP_ID,
      stepID: id,
    };
  },

  setStepPayload(
    stepID: string, 
    actionID: string, 
    payload: any,
  ): RunnerActionType {
    return {
      type: SET_STEP_PAYLOAD,
      stepID,
      actionID,
      payload,
    };
  },
};
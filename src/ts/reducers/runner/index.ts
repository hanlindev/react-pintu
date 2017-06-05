import {Dispatch} from 'react-redux';
import {ThunkAction} from 'redux-thunk';
import * as Immutable from 'immutable';

import {RunnerState, RunnerActionType} from './common';
import * as common from './common';
import {IStepPayloadMap, IStepConfig, IFlow, IAction} from '../../lib/interfaces';
import {shape} from '../../lib/types';
import {history} from '../../lib/History';


export function runner(state: RunnerState, action: RunnerActionType) {
  if (!state) {
    state = new RunnerState();
  }

  switch (action.type) {
    case common.SET_FLOW:
      return state.setFlow(action.flow);
    case common.SET_STEP_ID:
      return state.setStepID(action.stepID);
    case common.SET_STEP_PAYLOAD:
      return state.setStepPayload(
        action.stepID,
        action.actionID,
        action.payload,
      );
    case common.SET_SNACK_MESSAGE:
      return state.setSnackMessage(action.message);
  }

  return state;
}

export * from './common';
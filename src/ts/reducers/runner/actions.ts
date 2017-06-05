import {Dispatch} from 'react-redux';
import {ThunkAction} from 'redux-thunk';
import {NextStepNavigator} from './NextUrlLoader';
import {RunnerActionType, RunnerState} from './common';
import * as common from './common';
import {IFlow, IStepConfig, IAction, IActionDestination} from '../../lib/interfaces';
import {ContainerRegistry} from '../../lib/ContainerRegistry';
import {shape} from '../../lib/types';

interface IStoreWithRunnerState {
  [name: string]: any;

  runner: RunnerState;
}

function shouldNavigate(action: IAction, destination: IActionDestination | null) {
  return (
    (action.type === 'endOfStep' || action.type === 'replaceStep')
    && destination && destination.type === 'step'
  );
}

export const actions = {
  setFlow(flow: IFlow): RunnerActionType {
    return {
      type: common.SET_FLOW,
      flow,
    };
  },

  setStepID(id: string): RunnerActionType {
    return {
      type: common.SET_STEP_ID,
      stepID: id,
    };
  },

  setStepPayload(
    stepID: string, 
    actionID: string, 
    payload: any,
  ): RunnerActionType {
    return {
      type: common.SET_STEP_PAYLOAD,
      stepID,
      actionID,
      payload,
    };
  },

  setSnackMessage(message: string | null): RunnerActionType {
    return {
      type: common.SET_SNACK_MESSAGE,
      message,
    }
  },

  performAction(
    step: IStepConfig,
    action: IAction,
    payload: any,
    registry: ContainerRegistry,
    runnerUrlTemplate: string,
  ): ThunkAction<void, void, IStoreWithRunnerState> {
    return (
      dispatch: Dispatch<RunnerActionType>, 
      getState: () => IStoreWithRunnerState,
    ) => {
      const payloadShape = shape(action.payload)();
      if (payloadShape.validate(payload)) {
        dispatch(actions.setStepPayload(step.id, action.id, payload));
        const newState = getState().runner;
        const flow = newState.flow;

        const destination = step.destinations[action.id];
        if (shouldNavigate(action, destination) && flow) {
          const nextConfig = flow.steps[destination.stepID];
          const navigator = new NextStepNavigator(
            newState.getStepPayloadMap(), 
            nextConfig,
            registry,
            runnerUrlTemplate,
          );
          navigator.navigate(action.type);
        }
      } else {
        dispatch(actions.setSnackMessage('Payload has invalid shape'));
      }
    };
  },
};
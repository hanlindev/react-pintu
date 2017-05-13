import * as Immutable from 'immutable';

export interface IStepConfig {
  id: string;
}

const BuilderRecord = Immutable.Record({
  steps: Immutable.Map(),
});

export class BuilderState extends BuilderRecord {
  steps: Immutable.Map<string, IStepConfig>;

  createStep(newStep: IStepConfig) {
    return this.setIn(['steps', newStep.id], newStep);
  }

  getSteps(): {[key: string]: IStepConfig} {
    return this.steps.toJS();
  }
}

const CREATE_STEP = 'builder.createStep';

type BuilderActionType =
{
  type: 'builder.createStep',
  newStep: IStepConfig,
};

export function builder(state: BuilderState, action: BuilderActionType) {
  if (!state) {
    state = new BuilderState();
  }

  switch (action.type) {
    case CREATE_STEP:
      return state.createStep(action.newStep);
  }
  return state;
}

export const actions = {
  createStep(newStep: IStepConfig) {
    return {
      type: CREATE_STEP,
      newStep,
    };
  }
}
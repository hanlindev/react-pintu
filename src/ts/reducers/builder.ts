import * as _ from 'lodash';
import * as Immutable from 'immutable';
import {DiagramEngine, IInputsDeclaration, IActionsDeclaration, IStepConfig, IFlowMetaData} from '../lib';


const BuilderRecord = Immutable.Record({
  flowMetaData: null,
  steps: Immutable.Map(),
});

export class BuilderState extends BuilderRecord {
  flowMetaData: IFlowMetaData | null;
  steps: Immutable.Map<string, IStepConfig>;

  setFlowMetaData(flowMetaData: IFlowMetaData) {
    return this.set('flowMetaData', flowMetaData);
  }

  setSteps(steps: {[key: string]: IStepConfig}) {
    if (this.flowMetaData) {
      const engine = DiagramEngine.getEngine(this.flowMetaData.flowID);
      _.forEach(steps, (step) => {
        engine.insertStep(step);
      });
    }
    return this.set('steps', Immutable.Map(steps));
  }

  createStep(newStep: IStepConfig) {
    if (this.flowMetaData) {
      const engine = DiagramEngine.getEngine(this.flowMetaData.flowID);
      engine.insertStep(newStep);
    }
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
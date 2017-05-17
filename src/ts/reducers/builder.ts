import * as _ from 'lodash';
import {DiagramEngine} from 'storm-react-diagrams';
import * as Immutable from 'immutable';
import {IFlow, IInputsDeclaration, IActionsDeclaration, IStepConfig, IFlowMetaData} from '../lib/interfaces';
import {FlowEngine} from '../lib/FlowEngine';


const BuilderRecord = Immutable.Record({
  flow: null,
});

export class BuilderState extends BuilderRecord {
  flow: IFlow | null;

  setFlow(flow: IFlow) {
    return this.set('flow', flow);
  }

  restoreFlowEngine() {
    const engine = this.getFlowEngine();
    if (this.flow && engine) {
      engine.restoreFlow(this.flow);
    }
    return this;
  }

  getFlowEngine(): FlowEngine | null {
    if (this.flow) {
      return FlowEngine.getEngine(this.flow);
    }
    return null;
  }

  getDiagramEngine(): DiagramEngine | null {
    const flowEngine = this.getFlowEngine();
    if (flowEngine) {
      return flowEngine.diagramEngine;
    }
    return null;
  }

  createStep(newStep: IStepConfig) {
    const engine = this.getFlowEngine();
    if (engine) {
      engine.insertStep(newStep);
    }
    return this.setIn(['steps', newStep.id], newStep);
  }

  getSteps(): {[key: string]: IStepConfig} {
    if (this.flow) {
      return this.flow.steps;
    }
    return {};
  }
}

const CREATE_STEP = 'builder.createStep';
const SET_FLOW = 'builder.setFlow';
const RESTORE_FLOW = 'builder.restoreFlow';

type BuilderActionType =
{
  type: 'builder.createStep',
  newStep: IStepConfig,
}
| {
  type: 'builder.restoreFlow',
}
| {
  type: 'builder.setFlow',
  newFlow: IFlow,
};

export function builder(state: BuilderState, action: BuilderActionType) {
  if (!state) {
    state = new BuilderState();
  }

  switch (action.type) {
    case CREATE_STEP:
      return state.createStep(action.newStep);
    case SET_FLOW:
      return state.setFlow(action.newFlow);
    case RESTORE_FLOW:
      return state.restoreFlowEngine();
  }
  return state;
}

export const actions = {
  createStep(newStep: IStepConfig): BuilderActionType {
    return {
      type: CREATE_STEP,
      newStep,
    };
  },

  setFlow(newFlow: IFlow): BuilderActionType {
    return {
      type: SET_FLOW,
      newFlow,
    };
  },

  restoreFlow(): BuilderActionType {
    return {
      type: RESTORE_FLOW,
    };
  },

  loadFlow(newFlow: IFlow) {
    return (dispatch: Function) => {
      dispatch(actions.setFlow(newFlow));
      dispatch(actions.restoreFlow());
    }
  },
}
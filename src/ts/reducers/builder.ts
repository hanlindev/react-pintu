import * as _ from 'lodash';
import {DiagramEngine} from 'storm-react-diagrams';
import * as Immutable from 'immutable';
import {IFlow, IInputsDeclaration, IActionsDeclaration, IStepConfig, IFlowMetaData} from '../lib/interfaces';
import {FlowEngine} from '../lib/FlowEngine';


const BuilderRecord = Immutable.Record({
  flowMetaData: null,
  steps: Immutable.Map(),
  firstStepID: '0',
  serializedDiagram: null,
});

export class BuilderState extends BuilderRecord {
  flowMetaData: IFlowMetaData | null;
  steps: Immutable.Map<string, IStepConfig>;
  firstStepID: string;
  serializedDiagram: string | null;

  setFlow(flow: IFlow) {
    return this.merge({
      ...flow,
      steps: Immutable.Map(flow.steps),
    });
  }

  getFlowEngine(): FlowEngine | null {
    const flow = this.getFlow();
    if (flow) {
      return FlowEngine.getEngine(flow);
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

  getFlow(): IFlow | null {
    if (this.flowMetaData) {
      return {
        metaData: this.flowMetaData,
        steps: this.steps.toJS(),
        firstStepID: this.firstStepID,
        serializedDiagram: this.serializedDiagram,
      };
    }
    return null;
  }

  setSteps(steps: {[key: string]: IStepConfig}) {
    const engine = this.getFlowEngine();
    if (engine) {
      _.forEach(steps, (step) => {
        engine.insertStep(step);
      });
    }
    return this.set('steps', Immutable.Map(steps));
  }

  createStep(newStep: IStepConfig) {
    const engine = this.getFlowEngine();
    if (engine) {
      engine.insertStep(newStep);
    }
    return this.setIn(['steps', newStep.id], newStep);
  }

  getSteps(): {[key: string]: IStepConfig} {
    return this.steps.toJS();
  }
}

const CREATE_STEP = 'builder.createStep';
const SET_FLOW = 'builder.setFlow';

type BuilderActionType =
{
  type: 'builder.createStep',
  newStep: IStepConfig,
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
  }
  return state;
}

export const actions = {
  createStep(newStep: IStepConfig) {
    return {
      type: CREATE_STEP,
      newStep,
    };
  },

  setFlow(newFlow: IFlow) {
    return {
      type: SET_FLOW,
      newFlow,
    };
  },
}
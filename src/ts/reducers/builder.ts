import * as _ from 'lodash';
import {DiagramEngine} from 'storm-react-diagrams';
import * as Immutable from 'immutable';
import {ILinkSource, IFlow, IInputsDeclaration, IActionsDeclaration, IStepConfig, IFlowMetaData} from '../lib/interfaces';
import {FlowEngine} from '../lib/FlowEngine';

const BuilderRecord = Immutable.Record({
  flow: null,
});

export class BuilderState extends BuilderRecord {
  flow: IFlow | null;

  setFlow(flow: IFlow) {
    return this.set('flow', flow);
  }

  getFlowEngine(): FlowEngine | null {
    if (this.flow) {
      return FlowEngine.getEngine(this.flow);
    }
    return null;
  }

  getFlowClone(): IFlow | null{
    return _.cloneDeep(this.flow);
  }

  getDiagramEngine(): DiagramEngine | null {
    const flowEngine = this.getFlowEngine();
    if (flowEngine) {
      return flowEngine.diagramEngine;
    }
    return null;
  }

  createStep(newStep: IStepConfig, linkSrc?: ILinkSource) {
    const engine = this.getFlowEngine();
    if (engine) {
      engine.insertStep(newStep, linkSrc);
    }
    return this.setIn(['steps', newStep.id], newStep);
  }

  getSteps(): {[key: string]: IStepConfig} {
    if (this.flow) {
      return _.cloneDeep(this.flow.steps);
    }
    return {};
  }

  setSerializedDiagram(serializedDiagram: string) {
    return this.set('flow', {
      ...this.getFlowClone(),
      serializedDiagram,
    });
  }
}

const CREATE_STEP = 'builder.createStep';
const SET_FLOW = 'builder.setFlow';
const RESTORE_FLOW = 'builder.restoreFlow';
const SET_SERIALIZED_DIAGRAM = 'builder.setSerializedDiagram';

type BuilderActionType =
{
  type: 'builder.createStep',
  newStep: IStepConfig,
  linkSrc?: ILinkSource,
}
| {
  type: 'builder.setSerializedDiagram',
  serializedDiagram: string,
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
    case SET_SERIALIZED_DIAGRAM:
      return state.setSerializedDiagram(action.serializedDiagram);
  }
  return state;
}

export const actions = {
  createStep(newStep: IStepConfig, linkSrc?: ILinkSource): BuilderActionType {
    return {
      type: CREATE_STEP,
      newStep,
      linkSrc,
    };
  },

  setFlow(newFlow: IFlow): BuilderActionType {
    return {
      type: SET_FLOW,
      newFlow,
    };
  },

  setSerializedDiagram(serializedDiagram: string): BuilderActionType {
    return {
      type: SET_SERIALIZED_DIAGRAM,
      serializedDiagram,
    };
  },
}
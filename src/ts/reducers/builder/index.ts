import * as _ from 'lodash';
import {DiagramEngine, LinkModel} from 'storm-react-diagrams';
import {Dispatch} from 'react-redux';
import * as Immutable from 'immutable';
import {IDiagramChange} from '../../lib/FlowEngine/interfaces';
import {ILinkSource, IFlow, IInputsDeclaration, IActionsDeclaration, IStepConfig, IFlowMetaData} from '../../lib/interfaces';
import {BuilderActionType, SET_FLOW, UPDATE_STEP_CONFIGS, SET_SERIALIZED_DIAGRAM} from './common';

export function builder(state: BuilderState, action: BuilderActionType) {
  if (!state) {
    state = new BuilderState();
  }

  switch (action.type) {
    case SET_FLOW:
      return state.setFlow(action.newFlow);
    case UPDATE_STEP_CONFIGS:
      return state.updateStepConfigs(action.stepConfigChanges);
    case SET_SERIALIZED_DIAGRAM:
      return state.setSerializedDiagram(action.serializedDiagram);
  }
  return state;
}


const BuilderRecord = Immutable.Record({
  flow: null,
});

export class BuilderState extends BuilderRecord {
  flow: IFlow | null;

  setFlow(flow: IFlow) {
    return this.set('flow', flow);
  }

  getFlowClone(): IFlow | null{
    return _.cloneDeep(this.flow);
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

  updateStepConfigs(stepConfigChanges: {[stepID: string]: IStepConfig}) {
    const flowClone = this.getFlowClone();
    if (!flowClone) {
      return this;
    }

    return this.set('flow', {
      ...flowClone,
      steps: {
        ...flowClone.steps,
        ...stepConfigChanges,
      },
    });
  }
}
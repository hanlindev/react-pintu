import * as _ from 'lodash';
import {DiagramEngine, LinkModel} from 'storm-react-diagrams';
import {Dispatch} from 'react-redux';
import * as Immutable from 'immutable';
import {IDiagramChange} from '../../lib/FlowEngine/interfaces';
import {FlowEngine} from '../../lib/FlowEngine';
import {ILinkSource, IFlow, IInputsDeclaration, IActionsDeclaration, IStepConfig, IFlowMetaData} from '../../lib/interfaces';
import {NodeModel} from '../../components/ui/diagrams/NodeModel';
import {BuilderActionType, SET_FLOW, UPDATE_STEP_CONFIGS, SET_SERIALIZED_DIAGRAM, SET_SNACK_MESSAGE, SET_SELECTED_NODE} from './common';

export function builder(state: BuilderState, action: BuilderActionType) {
  if (!state) {
    state = new BuilderState();
  }

  switch (action.type) {
    case SET_FLOW:
      return state.setFlow(action.newFlow);
    case UPDATE_STEP_CONFIGS:
      return state.updateStepConfigs(action.stepConfigChanges);
    case SET_SNACK_MESSAGE:
      return state.setSnackMessage(action.message);
    case SET_SERIALIZED_DIAGRAM:
      return state.setSerializedDiagram(action.serializedDiagram);
    case SET_SELECTED_NODE:
      return state.setSelectedNode(action.node);
  }
  return state;
}


const BuilderRecord = Immutable.Record({
  flow: null,
  snackMessage: null,
  selectedNode: null,
});

export class BuilderState extends BuilderRecord {
  flow: IFlow | null;
  snackMessage: string | null;
  selectedNode: NodeModel | null;

  setFlow(flow: IFlow) {
    return this.set('flow', flow);
  }

  setSnackMessage(message: string | null) {
    return this.set('snackMessage', message);
  }

  getFlowClone(): IFlow | null{
    return _.cloneDeep(this.flow);
  }

  getFlowEngine(): FlowEngine | null {
    if (this.flow) {
      return FlowEngine.getEngine(this.flow);
    }
    return null;
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

  setSelectedNode(node: NodeModel | null) {
    return this.set('selectedNode', node);
  }

  updateStepConfigs(stepConfigChanges: {[key: string]: IStepConfig}) {
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
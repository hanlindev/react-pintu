import {Dispatch} from 'react-redux';
import {FlowEngine} from '../../lib/FlowEngine';
import {IFlow, IStepConfig} from '../../lib/interfaces';
import {DiagramListener, IDiagramEvents} from '../../lib/FlowEngine/listeners/DiagramListener';
import {IDiagramChange} from '../../lib/FlowEngine/interfaces';
import {BuilderActionType} from './common';
import * as common from './common';

function getFlowEngine(flow: IFlow) {
  return FlowEngine.getEngine(flow);
}

export function getDiagramEngine(flow: IFlow) {
  const flowEngine = FlowEngine.getEngine(flow);
  return flowEngine.diagramEngine;
}

let currentFlow: IFlow;

export const actions = {
  setFlow(newFlow: IFlow): BuilderActionType {
    currentFlow = newFlow;
    return {
      type: common.SET_FLOW,
      newFlow,
    };
  },

  syncNewFlow(newFlow: IFlow) {
    currentFlow = newFlow;
    return (dispatch: Dispatch<BuilderActionType>) => {
      const eventHandlers: IDiagramEvents = {
        onDiagramChange(change: IDiagramChange) {
          dispatch(actions.handleLinkChange(currentFlow, change));          
        },

        onSerializeDiagram(serialized: string) {
          dispatch(actions.setSerializedDiagram(serialized));
        },
      };

      const flowEngine = getFlowEngine(newFlow);
      flowEngine.syncFlow(newFlow, dispatch);
      DiagramListener.register(flowEngine.diagramEngine, eventHandlers);
      dispatch(actions.setFlow(newFlow));
    };
  },

  setSerializedDiagram(serializedDiagram: string): BuilderActionType {
    return {
      type: common.SET_SERIALIZED_DIAGRAM,
      serializedDiagram,
    };
  },

  saveDiagram(flow: IFlow) {
    return (dispatch: Dispatch<BuilderActionType>) => {
      const flowEngine = getFlowEngine(flow);
      const serialized = JSON.stringify(flowEngine.diagramModel.serializeDiagram());
      dispatch(actions.setSerializedDiagram(serialized));
    }
  },

  updateStepConfigs(
    stepConfigChanges: {[stepID: string]: IStepConfig},
  ): BuilderActionType {
    return {
      type: common.UPDATE_STEP_CONFIGS,
      stepConfigChanges,
    };
  },

  handleLinkChange(
    flow: IFlow, 
    linkChange: IDiagramChange,
  ) {
    return (dispatch: Dispatch<BuilderActionType>) => {
      const flowEngine = getFlowEngine(flow);
      let stepConfigChange = {};
      if (flowEngine) {
        if (linkChange.isValid(flowEngine)) {
          stepConfigChange = linkChange.accept(flowEngine);
        } else {
          linkChange.reject(flowEngine);
        }

        flow.steps = {
          ...flow.steps,
          ...stepConfigChange,
        };
      }
      dispatch(actions.updateStepConfigs(stepConfigChange));
      dispatch(actions.saveDiagram(flow));
    };
  },
}

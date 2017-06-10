import * as _ from 'lodash';
import {Dispatch} from 'react-redux';
import {FlowEngine} from '../../lib/FlowEngine';
import {IFlow, IStepConfig, IStepConfigMapChange, IFlowMetaDataMap, SaveFlowCallbackType, FlowSaveResultType} from '../../lib/interfaces';
import {DiagramListener, IDiagramEvents} from '../../lib/FlowEngine/listeners/DiagramListener';
import {IDiagramChange} from '../../lib/FlowEngine/interfaces';
import {NodeModel} from '../../components/ui/diagrams/NodeModel';
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

  setIsSavingFlow(isSavingFlow: boolean): BuilderActionType {
    return {
      type: common.SET_IS_SAVING_FLOW,
      isSavingFlow,
    };
  },

  saveFlow(newFlow: IFlow, saveFlowCallback: SaveFlowCallbackType) {
    return async (dispatch: Dispatch<BuilderActionType>) => {
      dispatch(actions.setIsSavingFlow(true));
      const saveResult = await saveFlowCallback(newFlow);
      dispatch(actions.setIsSavingFlow(false));

      switch (saveResult.type) {
        case 'error':
          dispatch(actions.setSnackMessage(saveResult.message));
          break;
        case 'delay':
          saveResult.onStartSaving(() => {
            dispatch(actions.setIsSavingFlow(true));
          });
          saveResult.onFinishSaving((result: FlowSaveResultType) => {
            dispatch(actions.setIsSavingFlow(false));
            switch (result.type) {
              case 'success':
                dispatch(actions.setSnackMessage('Flow data saved'));
                break;
              case 'error':
                dispatch(actions.setSnackMessage(result.message));
                break;
            }
          });
          break;
      }
    };
  },

  updateCurrentFlow(
    newFlow: IFlow, 
    saveFlowCallback: SaveFlowCallbackType,
  ) {
    if (newFlow.id !== currentFlow.id) {
      throw new TypeError('Unable to update non-loaded flow');
    }

    return async (dispatch: Dispatch<BuilderActionType>) => {
      dispatch(actions.saveFlow(newFlow, saveFlowCallback));
      dispatch(actions.setFlow(newFlow));
    };
  },

  setFlowList(flowList: IFlowMetaDataMap): BuilderActionType {
    return {
      type: common.SET_FLOW_LIST,
      flowList,
    };
  },

  setSelectedNode(node: NodeModel | null): BuilderActionType {
    return {
      type: common.SET_SELECTED_NODE,
      node,
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

        onSelectionChange(node: NodeModel | null) {
          dispatch(actions.setSelectedNode(node));
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

  setSnackMessage(message: string | null): BuilderActionType {
    return {
      type: common.SET_SNACK_MESSAGE,
      message,
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
      console.log({
        change: linkChange,
        isValid: linkChange.validate(flowEngine),
      }); // fd
      if (flowEngine) {
        let stepConfigChange: IStepConfigMapChange = {};
        if (linkChange.validate(flowEngine)) {
          stepConfigChange = linkChange.accept(flowEngine);
          _.forEach(stepConfigChange, (value, id: string) => {
            if (!value) {
              delete flow.steps[id];
            } else {
              flow.steps[id] = value;
            }
          });
        } else {
          dispatch(actions.setSnackMessage(linkChange.getInvalidReason()));
          linkChange.reject(flowEngine);
        }
      }
      dispatch(actions.setFlow(flow));
      dispatch(actions.saveDiagram(flow));
    };
  },
}

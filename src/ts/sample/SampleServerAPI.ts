import * as _ from 'lodash';
import * as qs from 'qs';
import {IFlowMetaData, IFlow, FlowSaveResultType, IURLLocation, IURLParams, IFlowMetaDataMap, IDefaultStepData, resolveUrlStepId} from '../.';

const DefaultFlow: IFlow = {
  id: '1',
  metaData: {
    urlIdOverride: '',
    description: 'Dummy Flow 1',
    name: 'Dummy Flow 1',
  },
  firstStepID: '0',
  steps: {
    0: {
      id: '0',
      containerName: 'SampleView',
      sources: [],
      destinations: {},
      inputSources: {},
      urlIdOverride: '',
    },
    1: {
      id: '1',
      containerName: 'SampleView',
      sources: [],
      destinations: {},
      inputSources: {},
      urlIdOverride: '',
    }
  },
  serializedDiagram: null,
}

interface ISavedFlows {
  nextId: number,
  flows: {[id: string]: IFlow},
}

function getSavedFlows(): ISavedFlows {
  const savedFlowString = localStorage.getItem('savedFlows');
  let savedFlows = {
    nextId: 0,
    flows: {},
  };
  if (savedFlowString) {
    savedFlows = JSON.parse(savedFlowString);
  }
  return savedFlows;
}

function onCreateFlow(data: IFlowMetaData): Promise<string> {
  return new Promise<string>((resolve) => {
    const savedFlows = getSavedFlows();
    const newFlows: ISavedFlows = {
      nextId: savedFlows.nextId + 1,
      flows: {
        ...savedFlows.flows,
        [savedFlows.nextId]: {
          id: savedFlows.nextId.toString(),
          metaData: data,
          firstStepID: '0',
          steps: {},
          serializedDiagram: null,
        },
      },
    };

    localStorage.setItem('savedFlows', JSON.stringify(newFlows));
    resolve(savedFlows.nextId.toString());
  });
}

function onLoadFlow(flowID: string): Promise<IFlow> {
  return new Promise<IFlow>((resolve) => {
    const savedFlows = getSavedFlows();
    resolve(savedFlows.flows[flowID]);
  });
}

function onLoadFlowList(): Promise<IFlowMetaDataMap> {
  return new Promise<IFlowMetaDataMap>((resolve) => {
    const savedFlows = getSavedFlows();
    const result: IFlowMetaDataMap = {};
    _.forEach(savedFlows.flows, (flow) => {
      result[flow.id] = flow.metaData;
    });
    resolve(result);
  });
}

async function onEditFlow<TK extends keyof IFlow>(
  flowID: string, 
  newFields: Pick<IFlow, keyof IFlow>,
): Promise<FlowSaveResultType> {
  const flow = await onLoadFlow(flowID);
  const newFlow = {
    ...flow,
    ...newFields,
  };
  return await onAutoSaveFlow(newFlow);
}

let saveFlowTimeout: number | null;
let lastSaveResult: FlowSaveResultType | null = null;
let startCallback: (() => any) | null;
let finishCallback: ((result: FlowSaveResultType) => any) | null;
function startDelayedSavingRegister(cb: () => any) {
  if (saveFlowTimeout) {
    cb();
  }
  startCallback = cb;
}

function finishDelayedSavingRegister(cb: (result: FlowSaveResultType) => any) {
  if (lastSaveResult) {
    cb(lastSaveResult);
  }
  finishCallback = cb;
}

function onAutoSaveFlow(newFlow: IFlow): Promise<FlowSaveResultType> {  
  return new Promise<FlowSaveResultType>((resolve) => {
    lastSaveResult = null;
    startCallback = null;
    finishCallback = null;
    saveFlowTimeout && clearTimeout(saveFlowTimeout);
    saveFlowTimeout = null;
    resolve({
      type: 'delay',
      timeout: 5,
      onStartSaving: startDelayedSavingRegister,
      onFinishSaving: finishDelayedSavingRegister,
    });
    saveFlowTimeout = setTimeout(
      () => {
        startCallback && startCallback();
        const savedFlows = getSavedFlows();
        savedFlows.flows[newFlow.id] = newFlow;
        localStorage.setItem('savedFlows', JSON.stringify(savedFlows));
        finishCallback && finishCallback({type: 'success', savedFlow: newFlow});
      },
      2000,
    );
  });
}

function onUserSaveFlow(newFlow: IFlow): Promise<FlowSaveResultType> {
  return new Promise<FlowSaveResultType>((resolve) => {
    const savedFlows = getSavedFlows();
    savedFlows.flows[newFlow.id] = newFlow;
    localStorage.setItem('savedFlows', JSON.stringify(savedFlows));
    resolve({
      type: 'success',
      savedFlow: newFlow,
    });
  });
}

function onRunnerLoadFlow(location: IURLLocation, params: IURLParams): Promise<IFlow> {
  return new Promise<IFlow>((resolve) => {
    const savedFlows = getSavedFlows();
    const latestFlow = savedFlows.flows[savedFlows.nextId - 1];
    resolve(latestFlow);
  });
}

async function onGetStepID(location: IURLLocation, params: IURLParams, flow: IFlow): Promise<string> {
  if (flow) {
    return resolveUrlStepId(flow, params.stepID);
  }
  return params.stepID || '';
}

export {
  onCreateFlow,
  onLoadFlow,
  onLoadFlowList,
  onEditFlow,
  onAutoSaveFlow,
  onUserSaveFlow,
  onRunnerLoadFlow,
  onGetStepID,
}
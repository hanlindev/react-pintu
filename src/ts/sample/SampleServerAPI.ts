import * as _ from 'lodash';
import * as qs from 'qs';

import {IFlowMetaData, IFlow, FlowSaveResultType} from '../.';

const DefaultFlow: IFlow = {
  id: '1',
  metaData: {
    description: 'Dummy Flow 1',
    name: 'Dummy Flow 1',
  },
  firstStepID: '0',
  steps: {
    0: {
      id: '0',
      containerName: 'SampleView',
      sources: [],
      destinations: {
      },
    },
    1: {
      id: '1',
      containerName: 'SampleView',
      sources: [],
      destinations: {},
    }
  },
  serializedDiagram: null,
}

function onCreateFlow(data: IFlowMetaData): Promise<string> {
  return new Promise<string>((resolve) => {
    resolve(_.uniqueId('dummy-flow-'));
  });
}

function onLoadFlow(flowID: string): Promise<IFlow> {
  return new Promise<IFlow>((resolve) => {
    const queryStringIndex = location.href.indexOf('?');

    const params = qs.parse(location.href.slice(queryStringIndex + 1));
    if (queryStringIndex < 0 || params.new) {
      const savedString = localStorage.getItem('localFlow');
      if (savedString) {
        resolve(JSON.parse(savedString));
        return;
      }
    }
    resolve(DefaultFlow);
  });
}

function onAutoSaveFlow(newFlow: IFlow): Promise<FlowSaveResultType> {  
  return new Promise<FlowSaveResultType>((resolve) => {
    localStorage.setItem('localFlow', JSON.stringify(newFlow));
    resolve({
      type: 'success',
    });
  });
}

function onUserSaveFlow(newFlow: IFlow): Promise<FlowSaveResultType> {
  return new Promise<FlowSaveResultType>((resolve) => {
    localStorage.setItem('localFlow', JSON.stringify(newFlow));
    resolve({
      type: 'success',
    });
  });
}

export {
  onCreateFlow,
  onLoadFlow,
  onAutoSaveFlow,
  onUserSaveFlow,
}
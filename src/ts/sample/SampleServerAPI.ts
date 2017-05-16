import * as _ from 'lodash';

import {IFlowMetaData, IFlow} from '../.';

function onCreateFlow(data: IFlowMetaData): Promise<string> {
  return new Promise<string>((resolve) => {
    resolve(_.uniqueId('dummy-flow-'));
  });
}

function onLoadFlow(flowID: string): Promise<IFlow> {
  return new Promise<IFlow>((resolve) => {
    const dummyFlow: IFlow = {
      metaData: {
        flowID: '1',
        flowDescription: 'Dummy Flow 1',
        flowName: 'Dummy Flow 1',
      },
      firstStepID: '0',
      steps: {
        0: {
          id: '0',
          containerName: 'SampleView',
          destinations: {},
        },
      },
      serializedDiagram: null,
    };
    resolve(dummyFlow);
  });
}

export {
  onCreateFlow,
  onLoadFlow,
}
import {LogicContainer} from '../../lib/LogicContainer';
import {IContainerSpec} from '../../lib/ContainerRegistry';
import * as Types from '../../lib/types';

interface IResult {

}

export class BranchLogic extends LogicContainer<IResult> {
  static container: IContainerSpec = {
    name: 'SampleLogic',
    pathTemplate: '/sample_logic',
    inputs: {
      flag: Types.bool,
    },
    actions: {
      true: {
        id: 'true',
        label: 'True',
        type: 'endOfStep',
        payload: {},
      },
      false: {
        id: 'false',
        label: 'False',
        type: 'endOfStep',
        payload: {},
      },
    },
  };
  
  run(): Promise<IResult> {
    return new Promise((resolve, reject) => {
      resolve({});
    });
  }
}



import {LogicContainer} from '../../lib/LogicContainer';
import {IContainerSpec, IActionCallback} from '../../lib/interfaces';
import * as Types from '../../lib/types';

interface IResult {

}

export class BranchLogic extends LogicContainer<IResult> {
  getContainerSpec(): IContainerSpec {
    return {
      name: 'SampleLogic',
      pathTemplate: '/sample_logic',
      inputs: {
        flag: Types.bool,
      },
      actions: {
        'true': {
          id: 'true',
          label: 'True',
          type: 'endOfStep',
          payload: {},
        },
        'false': {
          id: 'false',
          label: 'False',
          type: 'endOfStep',
          payload: {},
        },
      },
    };
  }

  run(inputs: any, onAction: IActionCallback): Promise<IResult> {
    return new Promise((resolve, reject) => {
      try {
        if (inputs.flag) {
          onAction('true', {});
        } else {
          onAction('false', {});
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}



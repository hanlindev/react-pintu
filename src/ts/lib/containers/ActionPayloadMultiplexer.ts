import {LogicContainer} from '../LogicContainer';
import {IContainerSpec, IActionCallback} from '../interfaces';
import * as Types from '../types';

interface IAutoInput {
  output: Object;
}

export class ActionPayloadMultiplexer extends LogicContainer<void> {
  static NextActionID = 'next';

  getContainerSpec(): IContainerSpec {
    return {
      name: 'ActionPayloadMultiplexer',
      inputs: {
        actionPayload: Types.object,
      },
      actions: {
        next: {
          id: 'next',
          label: 'Next',
          type: 'replaceStep',
          payload: {},
        },
      },
      pathTemplate: '/multiplex_action_payload',
    };
  }

  run(input: any, onAction: IActionCallback): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      onAction('next', input.actionPayload);
    });
  }
}
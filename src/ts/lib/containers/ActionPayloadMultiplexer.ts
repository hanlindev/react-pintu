import {LogicContainer} from '../LogicContainer';
import {IContainerSpec, IActionCallback} from '../interfaces';
import * as Types from '../types';

interface IAutoInput {
  output: Object;
}

export class ActionPayloadMultiplexer extends LogicContainer<void> {
  getContainerSpec(): IContainerSpec {
    return {
      name: 'ActionPayloadMultiplexer',
      inputs: {
        actionPayloadDeclaration: Types.object,
      },
      actions: {
        next: {
          id: 'next',
          label: 'Next',
          type: 'endOfStep',
          payload: {
            actionPayload: Types.object.isRequired,
          },
        },
      },
      pathTemplate: '/multiplex_action_payload',
    };
  }

  run(input: any, onAction: IActionCallback): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      onAction('next', input);
    });
  }
}
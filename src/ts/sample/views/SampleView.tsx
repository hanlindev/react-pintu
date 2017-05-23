import * as React from 'react';

import {Button} from '../../components/ui/Button';
import {IContainerSpec, IActionCallback} from '../../lib/interfaces';
import {UIContainer} from '../../lib/UIContainer';
import * as Types from '../../lib/types';

interface IProps {
  inputs: any;
  onAction: IActionCallback;
}

class SampleViewComponent extends React.Component<IProps, void> {
  render() {
    const style: React.CSSProperties = {
      marginLeft: 8,
    };

    return (
      <div>
        TODO
        <Button style={style} use="confirm">
          Confirm
        </Button>
        <Button style={style} use="default">
          Default
        </Button>
        <Button style={style} use="danger">
          Danger
        </Button>
      </div>
    );
  }
}

export class SampleView extends UIContainer {
  getContainerSpec(): IContainerSpec {
    return {
      name: 'SampleView',
      pathTemplate: '/sample',
      inputs: {
        testString: Types.string,
        testArray: Types.array,
        typeObject: Types.object,
        testNumber: Types.number,
        testBool: Types.bool,
      },
      actions: {
        testAction1: {
          id: 'testAction1',
          label: 'Test Action 1',
          type: 'endOfStep',
          payload: {
            strArg: Types.string,
          }
        },
        testAction2: {
          id: 'testAction2',
          label: 'Test Action 2',
          type: 'intermediate',
          payload: {
            numArg: Types.number,
          },
        }
      },
    };
  }

  render(inputs: any, onAction: IActionCallback) {
    return (
      <SampleViewComponent inputs={inputs} onAction={onAction} />
    );
  }
}
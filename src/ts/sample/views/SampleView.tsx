import * as React from 'react';

import {Button} from '../../components/ui/Button';
import {IContainerSpec, IActionCallback} from '../../lib/interfaces';
import {UIContainer} from '../../lib/UIContainer';
import * as Types from '../../lib/types';

interface IInputs {
  testString: string;
  testArray?: Array<any>;
  testObject?: Object;
  testNumber?: number;
  testBool?: boolean;
}

interface IProps {
  inputs: IInputs;
  onAction: IActionCallback;
}

class SampleViewComponent extends React.Component<IProps, void> {
  onTestAction(button: string) {
    const {onAction} = this.props;
    onAction('testAction', {
      strArg: button,
      numArg: 0,
    });
  }

  render() {
    const {
      inputs: {
        testString,
      },
    } = this.props;

    const style: React.CSSProperties = {
      marginLeft: 8,
    };

    return (
      <div>
        {testString} was clicked
        <Button 
          style={style} 
          use="confirm"
          onClick={() => this.onTestAction('confirm')}
        >
          Confirm
        </Button>
        <Button 
          style={style} 
          use="default"
          onClick={() => this.onTestAction('default')}
        >
          Default
        </Button>
        <Button 
          style={style} 
          use="danger"
          onClick={() => this.onTestAction('danger')}
        >
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
      pathTemplate: '/sample/:testString',
      inputs: {
        testString: Types.string.isRequired,
        testArray: Types.array,
        typeObject: Types.object,
        testNumber: Types.number,
        testBool: Types.bool,
      },
      actions: {
        testAction: {
          id: 'testAction',
          label: 'Test Action',
          type: 'endOfStep',
          payload: {
            strArg: Types.string.isRequired,
            numArg: Types.number.isRequired,
          }
        },
      },
    };
  }

  render(inputs: any, onAction: IActionCallback) {
    return (
      <SampleViewComponent inputs={inputs} onAction={onAction} />
    );
  }
}
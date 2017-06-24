import * as React from 'react';

import {Button} from '../../components/ui/Button';
import {IContainerSpec, IActionCallback} from '../../lib/interfaces';
import {UIContainer} from '../../lib/UIContainer';
import * as Types from '../../lib/types';

interface IInputs {
  prevButton: string;
}

interface IProps {
  inputs: IInputs;
  onAction: IActionCallback;
}

class SampleViewComponent extends React.Component<IProps, void> {
  onTestAction(button: string) {
    const {onAction} = this.props;
    onAction('testAction', {
      buttonClicked: button,
    });
  }

  render() {
    const {
      inputs: {
        prevButton,
      },
    } = this.props;

    const style: React.CSSProperties = {
      marginLeft: 8,
    };

    return (
      <div>
        {prevButton} was clicked
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

export class SampleView extends UIContainer<IInputs> {
  getContainerSpec(): IContainerSpec {
    return {
      name: 'SampleView',
      pathTemplate: '/sample(/:testString)',
      inputs: {
        prevButton: Types.string.isRequired,
      },
      actions: {
        testAction: {
          id: 'testAction',
          label: 'Test Action',
          type: 'endOfStep',
          payload: {
            buttonClicked: Types.string.isRequired,
          },
        },
      },
    };
  }

  render(inputs: IInputs, onAction: IActionCallback) {
    return (
      <SampleViewComponent inputs={inputs} onAction={onAction} />
    );
  }
}
import * as React from 'react';

import {UIContainer, IContainerSpec, IActionCallback} from '../../lib';
import * as Props from '../../lib/types';

interface IInputs {
  button1: string;
  button2: string;
}

interface IProps {
  inputs: IInputs;
}

export class SampleView2Component extends React.Component<IProps, void> {
  render() {
    const {
      inputs: {
        button1,
        button2,
      },
    } = this.props;
    return (
      <div>
        <div>
          First button clicked: {button1}
        </div>

        <div>
          Second button clicked: {button2}
        </div>
      </div>
    );
  }
}

export class SampleView2 extends UIContainer<IInputs> {
  getContainerSpec(): IContainerSpec {
    return {
      name: 'SampleView2',
      pathTemplate: '/sample2/:button1/:button2',
      inputs: {
        button1: Props.string.isRequired,
        button2: Props.string.isRequired,
      },
      actions: {},
    }
  }

  render(inputs: any, onAction: IActionCallback): JSX.Element {
    return (
      <SampleView2Component inputs={inputs} />
    );
  }
}
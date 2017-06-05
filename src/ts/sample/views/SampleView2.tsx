import * as React from 'react';

import {UIContainer, IContainerSpec, IActionCallback} from '../../lib';
import * as Props from '../../lib/types';

interface IInputs {
  arg1: string;
  arg2: string;
}

interface IProps {
  inputs: IInputs;
}

export class SampleView2Component extends React.Component<IProps, void> {
  render() {
    const {
      inputs: {
        arg1,
        arg2,
      },
    } = this.props;
    return (
      <div>
        <div>
          First button clicked: {arg1}
        </div>

        <div>
          Second button clicked: {arg2}
        </div>
      </div>
    );
  }
}

export class SampleView2 extends UIContainer<IInputs> {
  getContainerSpec(): IContainerSpec {
    return {
      name: 'SampleView2',
      pathTemplate: '/sample2/:arg1/:arg2',
      inputs: {
        arg1: Props.string.isRequired,
        arg2: Props.string.isRequired,
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
import * as React from 'react';
import {PortWidget} from 'storm-react-diagrams';

import {PintuActionPortModel} from './PintuActionPortModel';

export interface IPintuActionPortWidgetProps {
  model: PintuActionPortModel;
}

export class PintuActionPortWidget extends React.Component<IPintuActionPortWidgetProps, void> {
  render() {
    const {model} = this.props;
    const port = (
      <PortWidget name={model.getName()} node={model.getParent()} />
    );
    const label = model.getLabel();

    return (
      <div>
        {label}
        {port}
      </div>
    );
  }
}
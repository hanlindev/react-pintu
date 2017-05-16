import * as React from 'react';
import {PortWidget} from 'storm-react-diagrams';

import {PintuInputPortModel} from './PintuInputPortModel';

export interface IPintuInputPortWidgetProps {
  model: PintuInputPortModel;
}

export class PintuInputPortWidget extends React.Component<IPintuInputPortWidgetProps, void> {
  render() {
    const {model} = this.props;
    const port = (
      <PortWidget name={model.getName()} node={model.getParent()} />
    );
    const label = model.getLabel();

    return (
      <div>
        {port}
        {label}
      </div>
    );
  }
}
import * as React from 'react';
import {PortWidget} from 'storm-react-diagrams';

import {PintuEntrancePortModel} from './PintuEntrancePortModel';

export interface IPintuEntrancePortWidgetProps {
  model: PintuEntrancePortModel;
}

export class PintuEntrancePortWidget extends React.Component<IPintuEntrancePortWidgetProps, void> {
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
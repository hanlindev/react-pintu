import * as React from 'react';

import {PintuActionPortModel} from './PintuActionPortModel';
import {PintuActionPortWidget} from './PintuActionPortWidget';
import {PintuInputPortModel} from './PintuInputPortModel';
import {PintuInputPortWidget} from './PintuInputPortWidget';

export interface IPintuPortWidgetProps {
  model: PintuInputPortModel | PintuActionPortModel;
}

export class PintuPortWidget extends React.Component<IPintuPortWidgetProps, void> {
  render() {
    const {model} = this.props;
    if (model instanceof PintuInputPortModel) {
      return <PintuInputPortWidget model={model} />;
    } else {
      return <PintuActionPortWidget model={model} />;
    }
  }
}
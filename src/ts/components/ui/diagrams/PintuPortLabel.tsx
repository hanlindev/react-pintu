import * as React from 'react';

import {PintuActionPortModel} from './PintuActionPortModel';
import {PintuActionPortLabel} from './PintuActionPortLabel';
import {PintuEntrancePortModel} from './PintuEntrancePortModel';
import {PintuEntrancePortLabel} from './PintuEntrancePortLabel';
import {PintuInputPortModel} from './PintuInputPortModel';
import {PintuInputPortLabel} from './PintuInputPortLabel';

export interface IPintuPortLabelProps {
  style?: React.CSSProperties;
  model: PintuInputPortModel | PintuActionPortModel | PintuEntrancePortModel;
}

export class PintuPortLabel extends React.Component<IPintuPortLabelProps, void> {
  render() {
    const {model, ...others} = this.props;
    if (model instanceof PintuInputPortModel) {
      return <PintuInputPortLabel model={model} {...others} />;
    } else if (model instanceof PintuEntrancePortModel) {
      return <PintuEntrancePortLabel model={model} {...others} />;
    } else {
      return <PintuActionPortLabel model={model} {...others} />;
    }
  }
}
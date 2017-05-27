import * as React from 'react';

import {ActionPortModel} from './ActionPortModel';
import {ActionPortLabel} from './ActionPortLabel';
import {EntrancePortModel} from './EntrancePortModel';
import {EntrancePortLabel} from './EntrancePortLabel';
import {InputPortModel} from './InputPortModel';
import {InputPortLabel} from './InputPortLabel';
import {OutputPortModel} from './OutputPortModel';
import {OutputPortLabel} from './OutputPortLabel';

export interface IPortLabelProps {
  style?: React.CSSProperties;
  model: InputPortModel | ActionPortModel | EntrancePortModel;
}

export class PortLabel extends React.Component<IPortLabelProps, void> {
  render() {
    const {model, ...others} = this.props;
    if (model instanceof OutputPortModel) {
      return <OutputPortLabel model={model} {...others} />;
    } else if (model instanceof InputPortModel) {
      return <InputPortLabel model={model} {...others} />;
    } else if (model instanceof EntrancePortModel) {
      return <EntrancePortLabel model={model} {...others} />;
    } else {
      return <ActionPortLabel model={model} {...others} />;
    }
  }
}
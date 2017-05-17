import * as React from 'react';

import {PintuPortWidget as PortWidget} from './PintuPortWidget';
import {PintuEntrancePortModel} from './PintuEntrancePortModel';
import {ThemeableComponent} from '../ThemeableComponent';

export interface IPintuEntrancePortLabelProps {
  model: PintuEntrancePortModel;
  style?: React.CSSProperties;
}

export class PintuEntrancePortLabel extends ThemeableComponent<IPintuEntrancePortLabelProps, void> {
  render() {
    const {model, ...others} = this.props;
    const port = (
      <PortWidget 
        name={model.getName()} 
        port={model}
        node={model.getParent()} 
      />
    );
    const label = model.getLabel();

    return (
      <div {...others}>
        <div style={{display: 'inline-block'}}>
          {port}
        </div>
      </div>
    );
  }
}
import * as React from 'react';

import {PintuPortWidget as PortWidget} from './PintuPortWidget';
import {PintuInputPortModel} from './PintuInputPortModel';
import {ThemeableComponent} from '../ThemeableComponent';

export interface IPintuInputPortLabelProps {
  model: PintuInputPortModel;
  style?: React.CSSProperties;
}

export class PintuInputPortLabel extends ThemeableComponent<IPintuInputPortLabelProps, void> {
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
        <div
          style={{
            display: 'inline-block',
          }}
        >
          {port}
        </div>
        <div 
          style={{
            display: 'inline-block',
            verticalAlign: 'top',
            marginLeft: this.context.theme.spacing.tiny,
          }}
        >
          {label}
        </div>
      </div>
    );
  }
}
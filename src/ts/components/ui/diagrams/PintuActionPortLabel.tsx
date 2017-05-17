import * as React from 'react';

import {PintuPortWidget as PortWidget} from './PintuPortWidget';
import {PintuActionPortModel} from './PintuActionPortModel';
import {PintuPortWidget} from './PintuPortWidget';
import {ThemeableComponent} from '../ThemeableComponent';

export interface IPintuActionPortLabelProps {
  style?: React.CSSProperties;
  model: PintuActionPortModel;
}

export class PintuActionPortLabel extends ThemeableComponent<IPintuActionPortLabelProps, void> {
  render() {
    const {model, style, ...others} = this.props;
    const port = (
      <PortWidget 
        name={model.getName()} 
        port={model}
        node={model.getParent()} 
      />
    );
    const label = model.getLabel();

    return (
      <div 
        {...others}
        style={{
          height: 15,
          position: 'relative',
          top: 1,
          ...style,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            verticalAlign: 'top',
            position: 'relative',
            top: -2,
            marginLeft: this.context.theme.spacing.tiny,
          }}
        >
          {label}
        </div>
        <div style={{display: 'inline-block'}}>
          {port}
        </div>
      </div>
    );
  }
}
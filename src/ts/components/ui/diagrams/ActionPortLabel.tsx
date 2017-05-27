import * as React from 'react';

import {ActionPortModel} from './ActionPortModel';
import {PortWidget} from './PortWidget';
import {ThemeableComponent} from '../ThemeableComponent';

export interface IActionPortLabelProps {
  style?: React.CSSProperties;
  model: ActionPortModel;
}

export class ActionPortLabel extends ThemeableComponent<IActionPortLabelProps, void> {
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
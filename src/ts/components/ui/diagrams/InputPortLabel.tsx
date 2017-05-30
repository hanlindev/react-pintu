import * as React from 'react';

import {PortWidget} from './PortWidget';
import {InputPortModel} from './InputPortModel';
import {ThemeableComponent} from '../ThemeableComponent';
import {UseType} from './common';
import {style} from '../../../lib/styles'; 

export interface IInputPortLabelProps {
  model: InputPortModel;
  style?: React.CSSProperties;
  use?: UseType;
}

export class InputPortLabel extends ThemeableComponent<IInputPortLabelProps, void> {
  private getLabelStyle() {
    const result: React.CSSProperties = {
      display: 'inline-block',
      verticalAlign: 'top',
      marginLeft: this.context.theme.spacing.tiny,
      flex: 1,
      ...style('ellipsis'),
    };

    const {model} = this.props;
    if (model.type().isRequired()) {
      result.textDecoration = 'underline';
    }

    return result;
  }

  render() {
    const {model, use, style, ...others} = this.props;
    const port = (
      <PortWidget 
        name={model.getName()} 
        port={model}
        node={model.getParent()}
        use={use}
      />
    );
    const label = model.getLabel();

    return (
      <div 
        style={{
          ...style,
          width: '100%',
          display: 'flex',
        }}
        {...others}
      >
        <div
          style={{
            flex: '0 0 auto',
          }}
        >
          {port}
        </div>
        <div style={this.getLabelStyle()}>
          {label}
        </div>
      </div>
    );
  }
}
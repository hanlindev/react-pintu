import * as React from 'react';

import {PortWidget} from './PortWidget';
import {InputPortModel} from './InputPortModel';
import {ThemeableComponent} from '../ThemeableComponent';
import {UseType} from './common';

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
    };

    const {model} = this.props;
    if (model.type().isRequired()) {
      result.textDecoration = 'underline';
    }

    return result;
  }

  render() {
    const {model, use, ...others} = this.props;
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
      <div {...others}>
        <div
          style={{
            display: 'inline-block',
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
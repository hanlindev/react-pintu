import * as React from 'react';

import {NodeModel} from './NodeModel';
import {PortWidget} from './PortWidget';
import {InputPortModel} from './InputPortModel';
import {ThemeableComponent} from '../ThemeableComponent';
import {UseType} from './common';
import {style} from '../../../lib/styles'; 

export interface IInputPortLabelProps {
  parentNode: NodeModel;
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
    const {model, use, style, parentNode, ...others} = this.props;
    const {registry} = this.context;
    const port = (
      <PortWidget 
        name={model.getName()} 
        port={model}
        node={model.getParent()}
        use={use}
      />
    );
    let label = model.getLabel();
    const inputSource = parentNode.config.inputSources[model.argName];
    if (inputSource) {
      label += ' \u2713'; // A checkmark
    }

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
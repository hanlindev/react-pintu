import * as React from 'react';

import {PortWidget} from './PortWidget';
import {EntrancePortModel} from './EntrancePortModel';
import {ThemeableComponent} from '../ThemeableComponent';

export interface IEntrancePortLabelProps {
  model: EntrancePortModel;
  style?: React.CSSProperties;
}

export class EntrancePortLabel extends ThemeableComponent<IEntrancePortLabelProps, void> {
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
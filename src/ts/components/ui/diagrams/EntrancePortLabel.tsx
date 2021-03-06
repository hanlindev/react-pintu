import * as React from 'react';

import {NodeModel} from './NodeModel';
import {PortWidget} from './PortWidget';
import {EntrancePortModel} from './EntrancePortModel';
import {ThemeableComponent} from '../ThemeableComponent';
import {UseType} from './common';

export interface IEntrancePortLabelProps {
  parentNode: NodeModel;
  model: EntrancePortModel;
  style?: React.CSSProperties;
  use?: UseType;
}

export class EntrancePortLabel extends ThemeableComponent<IEntrancePortLabelProps, void> {
  render() {
    const {model, use, parentNode, ...others} = this.props;
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
        <div style={{display: 'inline-block'}}>
          {port}
        </div>
      </div>
    );
  }
}
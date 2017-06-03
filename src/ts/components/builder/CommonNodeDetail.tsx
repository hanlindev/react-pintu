import * as React from 'react';

import {NodeModel} from '../ui/diagrams/NodeModel';

interface IProps {
  node: NodeModel;
  style?: React.CSSProperties;
}

export class CommonNodeDetail extends React.Component<IProps, void> {
  render() {
    const {
      node,
      style,
    } = this.props;

    return (
      <div style={style}>
        Path Template: 
        <span
          style={{
            marginLeft: 4,
            textDecoration: 'underline',
          }}
        >
          {node.container.pathTemplate}
        </span>
      </div>
    );
  }
}
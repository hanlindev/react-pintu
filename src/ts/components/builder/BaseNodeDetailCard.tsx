import * as React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {ActionInputSource} from './ActionInputSource';
import {ConstantInputSource} from './ConstantInputSource';
import {NodeModel} from '../ui/diagrams/NodeModel';
import {PortLabel} from '../ui/diagrams/PortLabel';
import {InputPortModel} from '../ui/diagrams/InputPortModel';
import {FlowEngine} from '../../lib';

import {MiddleEmptyRow as Row} from '../ui/MiddleEmptyRow';

interface IBaseNodeDetailCardProps {
  node: NodeModel;
  style?: React.CSSProperties;
  expanded?: boolean;
  onExpandChange?: (expanded: boolean) => any;
  flowEngine: FlowEngine;
}

export class BaseNodeDetailCard extends React.Component<IBaseNodeDetailCardProps, void> {
  static defaultProps = {
    expanded: true,
  };

  render() {
    const {
      expanded,
      node,
      style,
      onExpandChange,
    } = this.props;

    return (
      <Card
        expanded={expanded}
        style={style}
        onExpandChange={onExpandChange}
      >
        <CardHeader
          title="Details"
          subtitle="Container Node"
          actAsExpander={true}
          showExpandableButton={true}
        />

        <CardText
          expandable={true}
        >
          {this.renderInputDetails()}
        </CardText>
      </Card>
    );
  }

  private renderInputDetails() {
    const {node} = this.props;
    const inputPorts = node.getInputPortModels();
    const rows = inputPorts.map((input, i) => {
      return (
        <Row
          key={input.getID()}
          style={{
            marginTop: (i > 0) ? 8 : 0,
            height: 48,
          }}
        >
          <div
            style={{
              width: 150,
            }}
          >
            <PortLabel
              model={input}
              use="others"
            />
          </div>
          
          {this.renderInputSource(input)}
        </Row>
      );
    });

    return (
      <div>
        {rows}
      </div>
    );
  }
  
  private renderInputSource(input: InputPortModel) {
    const {
      node,
      flowEngine,
    } = this.props;
    const {
      config: {
        inputSources,
      }
    } = node;
    const source = inputSources[input.argName];
    const width = 250;

    if (!source || source.type === 'constant') {
      return (
        <ConstantInputSource
          input={input}
          sourceSpec={source}
          flowEngine={flowEngine}
          style={{
            width,
          }}
          inputName={input.argName}
          node={node}
        />
      );
    }

    return (
      <div
        style={{
          width,
        }}
      >
        <ActionInputSource 
          inputPort={input}
          sourceSpec={source}
          flowEngine={flowEngine} 
        />
      </div>
    );
  }
}
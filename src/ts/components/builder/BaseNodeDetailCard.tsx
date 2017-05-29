import {NodeModel} from '../ui/diagrams/NodeModel';
import {PortLabel} from '../ui/diagrams/PortLabel';
import {InputPortModel} from '../ui/diagrams/InputPortModel';
import * as React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';

import {MiddleEmptyRow as Row} from '../ui/MiddleEmptyRow';

interface IBaseNodeDetailCardProps {
  node: NodeModel;
  style?: React.CSSProperties;
  expanded?: boolean;
  onExpandChange?: (expanded: boolean) => any;
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
          <div>
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
      node: {
        config: {
          inputSources,
        }
      },
    } = this.props;
    const source = inputSources[input.argName];

    if (!source) {
      return (
        <TextField
          hintText={input.type().getName()}
          style={{
            height: 34,
          }}
          hintStyle={{
            fontSize: 14,
            bottom: 5,
          }}
          inputStyle={{
            fontSize: 14,
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
          }}
        />
      );
    }

    switch (source.type) {
      case 'actionPayload':
        return (
          <div>
          </div>
        );
      case 'constant':
      default:
        return (
          <div>
          </div>
        );
    }
  }
}
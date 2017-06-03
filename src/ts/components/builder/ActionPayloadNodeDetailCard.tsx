import * as React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import {CommonNodeDetail} from './CommonNodeDetail';
import {ActionPortModel, NodeModel, InputPortLabel, InputPortModel, OutputPortModel} from '../ui/diagrams';
import {MiddleEmptyRow as Row} from '../ui/MiddleEmptyRow';
import {FlowEngine} from '../../lib/FlowEngine';
import {SelectModel} from '../../lib/FlowEngine/diagramTriggers';
import {style} from '../../lib/styles';

const LEFT_WIDTH = 150;
const RIGHT_WIDTH = 250;

interface IActionPayloadNodeDetailCardProps {
  node: NodeModel;
  style?: React.CSSProperties;
  expanded?: boolean;
  onExpandChange?: (expanded: boolean) => any;
  flowEngine: FlowEngine;
}

export class ActionPayloadNodeDetailCard extends React.Component<IActionPayloadNodeDetailCardProps, void> {
  render() {
    const {
      expanded,
      style,
      node,
      onExpandChange
    } = this.props;

    return (
      <Card
        expanded={expanded}
        style={style}
        onExpandChange={onExpandChange}
      >
        <CardHeader
          title="Details"
          subtitle="Multiplexer Node"
          actAsExpander={true}
          showExpandableButton={true}
        />

        <CardText
          expandable={true}
        >
          <CommonNodeDetail node={node} />
          <Row>
            <div style={{width: LEFT_WIDTH}}>
              Source Action
            </div>
            <div style={{width: RIGHT_WIDTH}}>
              {this.renderSourceButton()}
            </div>
          </Row>
          {this.renderOutputDetails()}
        </CardText>
      </Card>
    );
  }

  private renderSourceButton() {
    const {node, flowEngine} = this.props;
    const entrancePort = node.getEntrancePortModel();
    // There can only be one incoming link in a multiplexer node.
    const link = flowEngine.getOnlyLink(entrancePort);
    if (link) {
      const srcPort = link.getSourcePort() as ActionPortModel;
      const srcNode = flowEngine.getNodeRef(srcPort);
      const label = `Step ${node.config.id} - ${srcPort.action.label}`;
      return (
        <FlatButton
          primary={true}
          onClick={() => {
            (new SelectModel(srcNode)).trigger(flowEngine.getDiagramEngine());
          }}
          label={label}
          labelStyle={{textTransform: 'none'}}
        />
      );
    }

    return 'Source node not found';
  }

  private renderOutputDetails() {
    const {node, flowEngine} = this.props;
    const outputPorts = node.getOutputPortModels();
    return outputPorts.map((output) => {
      return (
        <Row
          key={output.getID()}
          style={{
            height: 48,
          }}
        >
          <div
            style={{
              width: LEFT_WIDTH,
            }}
          >
            <InputPortLabel
              model={output}
              use="others"
            />
          </div>
          
          <div style={{width: RIGHT_WIDTH}}>
            {this.renderOutputDestinationButton(output)}
          </div>
        </Row>
      );
    });
  }

  private renderOutputDestinationButton(output: OutputPortModel) {
    const {flowEngine} = this.props;
    const link = flowEngine.getOnlyLink(output);
    if (link) {
      const targetPort = link.getTargetPort() as InputPortModel;
      const targetNode = flowEngine.getNodeRef(targetPort);
      const label =
        `Linking to ${targetNode.config.id}: ${targetPort.argName}`;

      return (
        <FlatButton
          primary={true}
          onClick={() => {
            (new SelectModel(targetNode))
              .trigger(flowEngine.getDiagramEngine());
          }}
          label={label}
          labelStyle={{textTransform: 'none'}}
        />
      );
    }
    return (
      <div style={style('paddingVert', 16)}>
        Not connected with any input
      </div>
    );
  }
}

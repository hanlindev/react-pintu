import * as _ from 'lodash';
import * as React from 'react';
import FlatButton from 'material-ui/FlatButton';

import {InputPortModel} from '../ui/diagrams/InputPortModel';
import {FlowEngine} from '../../lib';
import {style} from '../../lib/styles';
import {IActionInputSource} from '../../lib/interfaces';
import {SelectModel, RemoveModel} from '../../lib/FlowEngine/diagramTriggers';

const ROW_WIDTH = 250;
const MAKE_CONSTANT_WIDTH = 113;
const GAP = 8;
const GO_TO_NODE_WIDTH = ROW_WIDTH - MAKE_CONSTANT_WIDTH - GAP;

interface IActionInputSourceProps {
  inputPort: InputPortModel;
  sourceSpec: IActionInputSource;
  flowEngine: FlowEngine;
}

export class ActionInputSource extends React.Component<IActionInputSourceProps, void> {
  getNode() {
    const {
      sourceSpec: {
        stepID,
      },
      flowEngine,
    } = this.props;
    return flowEngine.getNodeRef(stepID);
  }

  render() {
    return (
      <div>
        {this.renderGoToSourceButton()}
        {this.renderMakeConstantButton()}
      </div>
    )
  }

  private renderGoToSourceButton() {
    return (
      <div 
        title="Click to Select The Node"
        style={{
          display: 'inline-block',
          marginRight: GAP,
        }}
      >
        <FlatButton
          primary={true}
          onClick={() => this.onClickSource()}
          label={this.renderSourceLabel()}
          style={{
            textAlign: 'left',
            width: GO_TO_NODE_WIDTH,
          }}
          labelStyle={{
            width: '100%',
            textTransform: 'none',
            ...style('ellipsis'),
            ...style('paddingVert', 2),
          }}
        />
      </div>
    );
  }

  private renderSourceLabel() {
    const node = this.getNode();
    const {
      sourceSpec: {
        outputName,
      },
    } = this.props;

    return `Step ${node.config.id} - ${outputName}`;
  }

  private onClickSource() {
    const node = this.getNode();
    (new SelectModel(node)).trigger(this.props.flowEngine.getDiagramEngine());
  }

  private renderMakeConstantButton() {
    const {
      inputPort,
      flowEngine,
    } = this.props;

    return (
      <div 
        title="Click to make this input a constant"
        style={{
          display: 'inline-block',
          float: 'right',
          width: MAKE_CONSTANT_WIDTH,
        }}
      >
        <FlatButton
          secondary={true}
          onClick={() => {
            _.forEach(inputPort.getLinks(), (link) => {
              (new RemoveModel(link)).trigger(flowEngine.getDiagramEngine());
            });
          }}
          label="Make Constant"
          fullWidth={true}
          labelStyle={{
            textTransform: 'none',
            ...style('paddingVert', 4),
          }}
        />
      </div>
    );
  }
}
import * as React from 'react';
import {FlatButton, RaisedButton, Card, CardHeader, CardText, CardActions, TextField} from 'material-ui';

import {ActionPayloadNodeDetailCard} from './ActionPayloadNodeDetailCard';
import {BaseNodeDetailCard} from './BaseNodeDetailCard';
import {NodeModel} from '../ui/diagrams';
import {ThemeableComponent} from '../ui/ThemeableComponent';
import {IFlow, cssConstant, findStepIdOverrideError, BaseContainer, ActionPayloadMultiplexer, UIContainer} from '../../lib';
import {IFlowEngine} from '../../lib/FlowEngine/interfaces';
import {RemoveModel, ChangeNodeConfigField} from '../../lib/FlowEngine/diagramTriggers';

interface INodeDetailCardsProps {
  flow: IFlow,
  node: NodeModel;
  flowEngine: IFlowEngine;
  detailExpanded: boolean;
  onDetailExpansionChange: (expanded: boolean) => any;
}

interface IState {
  stepIdOverride: string;
  stepIdOverrideError: string | null;
}

export class NodeDetailCards extends ThemeableComponent<INodeDetailCardsProps, IState> {
  state: IState = {
    stepIdOverride: '',
    stepIdOverrideError: null,
  };

  componentDidUpdate(prevProps: INodeDetailCardsProps) {
    const {node} = this.props;
    const prevNode = prevProps.node;
    if (node && prevNode !== node) {
      this.setState({
        stepIdOverride: node.config.urlIdOverride || '',
        stepIdOverrideError: null,
      });
    }
  }


  render() {
    return (
      <div>
        {this.renderMetaCard()}
        {this.renderDetailCard()}
      </div>
    );
  }

  private renderMetaCard() {
    const {
      flow,
      flowEngine,
      node,
    } = this.props;
    const {
      stepIdOverride,
      stepIdOverrideError,
    } = this.state;
    const {config} = node;
    const container = this.context.registry.getContainer(config.containerName);
    const engine = flowEngine.getDiagramEngine();
    const metaTitle = 
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span 
          style={{
            border: cssConstant('border'),
              padding: 1,
              fontSize: 9,
            verticalAlign: 'middle',
            marginRight: 4,
          }}
        >
          {this.renderContainerType(container)}
        </span>
        <span>
          {config.containerName}
        </span>
      </div>;
    const metaSubtitle =
      <div>
        Step ID: {config.id}
      </div>
    return (
      <Card>
        <CardHeader
          title={metaTitle}
          subtitle={metaSubtitle}
        />
        <CardText
          style={{
            paddingTop: 0,
          }}
        >
          <TextField
            errorText={stepIdOverrideError}
            floatingLabelText="Step ID Override"
            hintText="A URL compatible string"
            value={stepIdOverride}
            onChange={(e, newValue) => {
              this.onStepIdOverrideChange(flow, node, newValue);
            }}
            onKeyUp={(e) => e.stopPropagation()}
          />
        </CardText>
        <CardActions>
          <RaisedButton
            primary
            label="Sample Page"
            onClick={() => {
              console.log('TODO show step container sample');// TODO
            }}
          />
          <FlatButton
            secondary
            label="Delete"
            onClick={() => {
              const trigger = new RemoveModel(node);
              trigger.trigger(engine);
            }}
          />
        </CardActions>
      </Card>
    );
  }

  private onStepIdOverrideChange(
    flow: IFlow, 
    node: NodeModel, 
    newValue: string,
  ) {
    this.setState({
      stepIdOverride: newValue,
      stepIdOverrideError: findStepIdOverrideError(flow, newValue),
    }, () => {
      if (!this.state.stepIdOverrideError) {
        const trigger = 
          new ChangeNodeConfigField(node, 'urlIdOverride', newValue);
        trigger.trigger(this.props.flowEngine.getDiagramEngine());
      }
    });
  }

  private renderContainerType(container: BaseContainer) {
    if (container instanceof ActionPayloadMultiplexer) {
      return 'Multiplexer';
    } else if (container instanceof UIContainer) {
      return 'UI';
    } else {
      return 'Logic';
    }
  }

  private renderDetailCard() {
    const {
      detailExpanded,
      onDetailExpansionChange,
      node,
    } = this.props;
    const {
      registry,
    } = this.context;
    const container = registry.getContainer(node.config.containerName);

    if (container instanceof ActionPayloadMultiplexer) {
      return (
        <ActionPayloadNodeDetailCard
          node={node}
          expanded={detailExpanded}
          style={{
            marginTop: 4,
          }}
          onExpandChange={(e) => {
            onDetailExpansionChange && onDetailExpansionChange(e);
          }}
          flowEngine={this.props.flowEngine}
        />
      );
    } else {
      return (
        <BaseNodeDetailCard
          node={node}
          expanded={detailExpanded}
          style={{
            marginTop: 4,
          }}
          onExpandChange={(e: boolean) => {
            onDetailExpansionChange && onDetailExpansionChange(e);
          }}
          flowEngine={this.props.flowEngine}
        />
      );
    }
  }
}
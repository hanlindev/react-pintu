import * as _ from 'lodash';
import * as React from 'react';
import * as Props from 'prop-types';
import * as cx from 'classnames';
import * as CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {CSSProperties} from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {FlatButton, RaisedButton, TextField} from 'material-ui';

import {BaseNodeDetailCard} from './BaseNodeDetailCard';
import {ActionPayloadNodeDetailCard} from './ActionPayloadNodeDetailCard';
import {NodeModel} from '../ui/diagrams/NodeModel';
import {ScrollableArea} from '../ui/ScrollableArea';
import {ContainerRegistry, LogicContainer, UIContainer, FlowEngine} from '../../lib';
import {findStepIdOverrideError} from '../../lib/utils';
import {RemoveModel, ChangeNodeConfigField} from '../../lib/FlowEngine/diagramTriggers';
import {BaseContainer} from '../../lib/BaseContainer';
import {ActionPayloadMultiplexer} from '../../lib/containers';
import {IFlow} from '../../lib/interfaces';

import '../../../scss/builder/node-detail-cards.scss';

const BORDER = '1px solid rgba(0, 0, 0, 0.4)';

interface INodeDetailCardsProps {
  node: NodeModel | null;
  flow: IFlow;
  flowEngine: FlowEngine;
}

interface IContext {
  registry: ContainerRegistry;
}

interface IState {
  detailExpanded: boolean;
  stepIdOverride: string;
  stepIdOverrideError: string | null;
}

export class NodeDetailCards extends React.Component<INodeDetailCardsProps, IState> {
  static contextTypes = {
    registry: Props.object,
  };

  context: IContext;
  state: IState;

  constructor(props: INodeDetailCardsProps) {
    super(props);
    let stepIdOverride = '';
    const {
      node,
      flow,
    } = props;
    this.state = {
      detailExpanded: true,
      stepIdOverride: '',
      stepIdOverrideError: null,
    };
  }

  private getRootStyle(): CSSProperties {
    return {
      boxSizing: 'border-box',
      width: '100%',
      height: '100%',
      userSelect: 'none',
    };
  }

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
      <div
        className={cx('node-detail-cards')}
        style={this.getRootStyle()}
      >
        <CSSTransitionGroup
          transitionName="root"
          transitionEnterTimeout={250}
          transitionLeaveTimeout={150}
        >
          {this.renderRoot()}
        </CSSTransitionGroup>
      </div>
    );
  }

  private renderRoot() {
    const {node} = this.props;
    
    if (!node) {
      return null;
    }

    return (
      <ScrollableArea 
        key="node-detail-card-root" 
        style={this.getRootStyle()}
        height="100%"
      >
        <div
          style={{
            pointerEvents: 'all',
          }}
        >
          {this.renderMetaCard(node)}
          {this.renderDetailCard(node)}
        </div>
      </ScrollableArea>
    );
  }

  private renderMetaCard(node: NodeModel) {
    const {
      flow,
      flowEngine,
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
            border: BORDER,
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

  private renderDetailCard(node: NodeModel) {
    const {
      detailExpanded,
    } = this.state;
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
            this.setState({detailExpanded: e});
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
          onExpandChange={(e) => {
            this.setState({detailExpanded: e});
          }}
          flowEngine={this.props.flowEngine}
        />
      );
    }
  }
}
import * as React from 'react';
import * as Props from 'prop-types';
import * as cx from 'classnames';
import * as CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {CSSProperties} from 'react';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import {BaseNodeDetailCard} from './BaseNodeDetailCard';
import {NodeModel} from '../ui/diagrams/NodeModel';
import {ScrollableArea} from '../ui/ScrollableArea';
import {ContainerRegistry, LogicContainer, UIContainer, FlowEngine} from '../../lib';
import {RemoveModel} from '../../lib/FlowEngine/diagramTriggers';
import {BaseContainer} from '../../lib/BaseContainer';
import {ActionPayloadMultiplexer} from '../../lib/containers';

import '../../../scss/builder/node-detail-cards.scss';

const BORDER = '1px solid rgba(0, 0, 0, 0.4)';

interface INodeDetailCardsProps {
  node: NodeModel | null;
  flowEngine: FlowEngine;
}

interface IContext {
  registry: ContainerRegistry;
}

interface IState {
  detailExpanded: boolean;
}

export class NodeDetailCards extends React.Component<INodeDetailCardsProps, IState> {
  static contextTypes = {
    registry: Props.object,
  };

  context: IContext;
  state: IState = {
    detailExpanded: true,
  };

  private getRootStyle(): CSSProperties {
    return {
      boxSizing: 'border-box',
      width: '100%',
      height: '100%',
      userSelect: 'none',
    };
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
    const {flowEngine} = this.props;
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
      </div>
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
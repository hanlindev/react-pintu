import * as React from 'react';
import * as Props from 'prop-types';
import * as cx from 'classnames';
import * as CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {CSSProperties} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {NodeModel} from '../ui/diagrams/NodeModel';
import {ContainerRegistry, LogicContainer, UIContainer} from '../../lib';
import {BaseContainer} from '../../lib/BaseContainer';
import {ActionPayloadMultiplexer} from '../../lib/containers';

import '../../../scss/builder/node-detail-cards.scss';

interface INodeDetailCardsProps {
  node: NodeModel | null;
}

interface IContext {
  registry: ContainerRegistry;
}

function Row(props: any) {
  const flexibleStyle: CSSProperties = {
    flex: '0 0 auto',
    flexWrap: 'nowrap',
  }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div style={flexibleStyle}>
        {props.children[0]}
      </div>

      <div style={{flex: 1}} />

      <div style={flexibleStyle}>
        {props.children[1]}
      </div>
    </div>
  );
}

export class NodeDetailCards extends React.Component<INodeDetailCardsProps, void> {
  static contextTypes = {
    registry: Props.object,
  };

  context: IContext;

  private getRootStyle(): CSSProperties {
    return {
      boxSizing: 'border-box',
      width: '100%',
      height: '100%',
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
      <div key="node-detail-card-root" style={this.getRootStyle()}>
        {this.renderMetaCard(node)}
      </div>
    );
  }

  private renderMetaCard(node: NodeModel) {
    const {config} = node;
    const container = this.context.registry.getContainer(config.containerName);
    return (
      <Card>
        <CardHeader
          title={config.containerName}
          subtitle={`Step ID: ${config.id}`}
        />
        <CardText>
          <Row>
            <span>Type</span>
            <span>{this.renderContainerType(container)}</span>
          </Row>
        </CardText>
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
}
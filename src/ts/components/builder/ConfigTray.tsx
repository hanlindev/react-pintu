import * as _ from 'lodash';
import * as React from 'react';
import * as Props from 'prop-types';
import * as cx from 'classnames';
import {Dispatch} from 'react-redux';
import * as CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {CSSProperties} from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {FlatButton, RaisedButton, TextField} from 'material-ui';

import {BaseNodeDetailCard} from './BaseNodeDetailCard';
import {ActionPayloadNodeDetailCard} from './ActionPayloadNodeDetailCard';
import {FlowDetailCards} from './FlowDetailCards';
import {NodeDetailCards} from './NodeDetailCards';
import {NodeModel} from '../ui/diagrams/NodeModel';
import {ScrollableArea} from '../ui/ScrollableArea';
import {BuilderActionType} from '../../reducers/builder/common';
import {ContainerRegistry, LogicContainer, UIContainer, FlowEngine, SaveFlowCallbackType, DeleteFlowCallbackType} from '../../lib';
import {findStepIdOverrideError} from '../../lib/utils';
import {RemoveModel, ChangeNodeConfigField} from '../../lib/FlowEngine/diagramTriggers';
import {BaseContainer} from '../../lib/BaseContainer';
import {ActionPayloadMultiplexer} from '../../lib/containers';
import {IFlow} from '../../lib/interfaces';

import '../../../scss/builder/config-tray.scss';

interface IConfigTrayProps {
  builderUrlPrefix: string;
  node: NodeModel | null;
  flow: IFlow;
  flowEngine: FlowEngine;
  dispatch: Dispatch<BuilderActionType>;
  saveFlowCallback: SaveFlowCallbackType;
  deleteFlowCallback: DeleteFlowCallbackType;
  isSavingFlow: boolean;
  runnerUrlTemplate: string;
}

interface IContext {
  registry: ContainerRegistry;
}

interface IState {
  flowMetaExpanded: boolean;
  detailExpanded: boolean;
}

export class ConfigTray extends React.Component<IConfigTrayProps, IState> {
  static contextTypes = {
    registry: Props.object,
  };

  context: IContext;
  state: IState = {
    detailExpanded: true,
    flowMetaExpanded: true,
  };

  private getRootStyle(): CSSProperties {
    return {
      boxSizing: 'border-box',
      height: '100%',
      position: 'absolute',
      userSelect: 'none',
      width: '100%',
    };
  }

  render() {
    return (
      <div
        className={cx('config-tray')}
        style={this.getRootStyle()}
      >
        <CSSTransitionGroup
          transitionName="root"
          transitionEnterTimeout={250}
          transitionLeaveTimeout={150}
          style={{
            position: 'relative',
          }}
        >
          {this.renderRoot()}
        </CSSTransitionGroup>
      </div>
    );
  }

  private renderRoot() {
    const {node} = this.props;
    
    let content;
    let key;
    if (!node) {
      content = this.renderFlowDetailCards();
      key = 'config-flow-details';
    } else {
      content = this.renderNodeDetailCards(node);
      key = 'config-node-details';
    }

    return (
      <ScrollableArea 
        key={key}
        style={this.getRootStyle()}
        height="100%"
      >
        {content}
      </ScrollableArea>
    );
  }

  private renderFlowDetailCards() {
    const {
      builderUrlPrefix,
      flow, 
      flowEngine,
      dispatch, 
      saveFlowCallback,
      deleteFlowCallback,
      isSavingFlow,
      runnerUrlTemplate,
    } = this.props;
    const {
      flowMetaExpanded,
    } = this.state;
    return (
      <div
        style={{
          pointerEvents: 'all',
        }}
      >
        <FlowDetailCards 
          builderUrlPrefix={builderUrlPrefix}
          dispatch={dispatch} 
          flow={flow} 
          flowEngine={flowEngine}
          saveFlowCallback={saveFlowCallback}
          deleteFlowCallback={deleteFlowCallback}
          isSavingFlow={isSavingFlow}
          metaExpanded={flowMetaExpanded}
          onMetaExpandsionChange={(expanded: boolean) => {
            this.setState({
              flowMetaExpanded: expanded,
            });
          }}
          runnerUrlTemplate={runnerUrlTemplate}
        />
      </div>
    );
  }

  private renderNodeDetailCards(node: NodeModel) {
    const {
      flow,
      flowEngine,
    } = this.props;
    const {
      detailExpanded,
    } = this.state;
    return (
      <div
        style={{
          pointerEvents: 'all',
        }}
      >
        <NodeDetailCards 
          node={node} 
          flow={flow}
          flowEngine={flowEngine}
          detailExpanded={detailExpanded}
          onDetailExpansionChange={(expanded: boolean) => {
            this.setState({
              detailExpanded: expanded,
            });
          }}
        />
      </div>
    );
  }
}
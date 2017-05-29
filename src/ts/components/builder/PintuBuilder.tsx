import * as _ from 'lodash';
import * as React from 'react';
import * as cx from 'classnames';
import {connect, Dispatch} from 'react-redux';
import {push} from 'react-router-redux';
import {DiagramEngine, DiagramModel, DiagramWidget, LinkModel} from 'storm-react-diagrams';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';
import {ScrollableArea} from '../ui/ScrollableArea';

import {IState} from '../../reducers';
import {actions, getDiagramEngine} from '../../reducers/builder/actions';
import {BuilderActionType} from '../../reducers/builder/common';

import {ContainerRegistry, FlowEngine, IFlow, FlowSaveResultType, IBuilderEventHandlers, IStepConfig, IFlowMetaData} from '../../lib';
import {NodeDetailCards} from './NodeDetailCards';
import {ContextPopover} from '../ui/ContextPopover';
import {NodeModel} from '../ui/diagrams/NodeModel';
import {ContainerSelector} from '../ui/ContainerSelector';
import {safe} from '../../lib/utils';

import 'storm-react-diagrams/src/sass.scss';
import '../../../scss/builder/main.scss';

interface IParams {
  flowID?: string;
}

interface IFlowCanvas {
  flow: IFlow;
  diagramEngine: DiagramEngine;
}

export interface IPintuBuilderProps {
  dispatch: Dispatch<BuilderActionType>;
  flowCanvas?: IFlowCanvas;
  onCreateFlow: (flowData: IFlowMetaData) => Promise<string>;
  onLoadFlow: (flowID: string) => Promise<IFlow>;
  onAutoSaveFlow: (flowData: IFlow) => Promise<FlowSaveResultType>;
  onUserSaveFlow: (flowData: IFlow) => Promise<FlowSaveResultType>;
  params: IParams;
  registry: ContainerRegistry;
  snackMessage: string | null;
  selectedNode: NodeModel | null;
}

interface IPintuBuilderState {
  isMovingCanvas: boolean;
  newNodeMenuPosition?: {y: number, x: number};
}

class PintuBuilder extends React.Component<IPintuBuilderProps, IPintuBuilderState> {
  state: IPintuBuilderState;

  constructor(props: IPintuBuilderProps) {
    super(props);

    this.state = {
      isMovingCanvas: false,
    };
  }

  private getDiagramEngine(
    flowEngine: FlowEngine | null,
  ): DiagramEngine | null {
    return (flowEngine) ? flowEngine.diagramEngine : null;
  }

  private getDiagramModel(
    flowEngine: FlowEngine | null,
  ): DiagramModel | null {
    const engine = this.getDiagramEngine(flowEngine);
    return engine && engine.getDiagramModel();
  }

  private getFlowData(
    flowCanvas: IFlowCanvas | undefined,
  ): IFlow | null {
    if (flowCanvas) {
      return flowCanvas.flow;
    }
    return null;
  }

  private async loadFlowData(flowID: string) {
    const flowData = await this.props.onLoadFlow(flowID);
    this.props.dispatch(actions.syncNewFlow(flowData));
  }

  private async createFlow(flowData: IFlowMetaData) {
    const {dispatch, onCreateFlow} = this.props;
    const flowID = await onCreateFlow(flowData);
    dispatch(push(`/builder/${flowID}`));
  }

  private serializeDiagram() {
    const {flowCanvas} = this.props;
    if (flowCanvas) {
      this.props.dispatch(actions.saveDiagram(flowCanvas.flow));
    }
  }

  componentDidMount() {
    const {
      params: {flowID},
      flowCanvas,
    } = this.props;
    if (flowID) {
      this.loadFlowData(flowID);
    }
  }

  componentWillReceiveProps(nextProps: IPintuBuilderProps) {
    const {
      params: {flowID}, 
      flowCanvas,
      onAutoSaveFlow,
    } = nextProps;
    if (flowID && flowID !== this.props.params.flowID) {
      this.loadFlowData(flowID);
    }

    const currentFlow = safe(this.props.flowCanvas).flow;
    const nextFlow = safe(flowCanvas).flow;
    if (nextFlow && !_.isEqual(currentFlow, nextFlow)) {
      onAutoSaveFlow(nextFlow);
    }
  }

  _getRootStyle(): React.CSSProperties {
    return {
      display: 'flex',
      flexFlow: 'row',
      height: '100%',
      position: 'relative',
      width: '100%',
    };
  }

  _getCanvasStyle(): React.CSSProperties {
    return {
      backgroundColor: 'rgb(60, 60, 60)',
      boxShadow: 'rgba(0, 0, 0, 0.7) 0px 0px 4px, rgba(0, 0, 0, 0.4) -4px 0px 8px',
      flex: 1,
      height: '100%',
      userSelect: 'none',
    };
  }

  _getConfigurationTrayStyle(): React.CSSProperties {
    return {
      boxSizing: 'border-box',
      flex: '0 0 auto',
      padding: 4,
      width: 400,
      height: '100%',
      position: 'absolute',
      right: 0,
      pointerEvents: 'none',
    }
  }

  _onRightClickCanvas(e: React.MouseEvent<any>) {
    if (!e.shiftKey) {
      e.preventDefault();
      const {screenX, screenY} = e;
      this.setNewNodeMenuPosition({
        y: screenY,
        x: screenX,
      });
    }
  }

  private dismissNewNodeMenu() {
    this.setState({newNodeMenuPosition: undefined});
  }

  _onMouseDownCanvas(e: React.MouseEvent<any>) {
    this.setState({
      isMovingCanvas: true,
    });
  }

  _onMouseUpCanvas(e: React.MouseEvent<any>) {
    this.setState({
      isMovingCanvas: false,
    });
    this.serializeDiagram();
  }

  private setNewNodeMenuPosition({y, x}: {y: number, x: number}) {
    this.setState({
      newNodeMenuPosition: {
        y: y - 70,
        x: x - 10,
      },
    });
  }

  render() {
    const {
      dispatch,
      flowCanvas,
      registry,
      snackMessage,
      selectedNode,
    } = this.props;
    const {
      newNodeMenuPosition,
    } = this.state;
    if (!flowCanvas) {
      return (
        <div 
          style={{
            boxSizing: 'border-box',
            height: '100vh', 
            paddingTop: 400,
            textAlign: 'center',
            width: '100vw',
          }}
        >
          <CircularProgress />
        </div>
      );
    }

    const rootClass = cx({
      'is-moving-canvas': this.state.isMovingCanvas,
    });
    return (
      <div
        className={rootClass}
        style={this._getRootStyle()}
      >
        <div 
          onContextMenu={(e) => this._onRightClickCanvas(e)}
          onClick={() => this.dismissNewNodeMenu()}
          onMouseDown={(e) => this._onMouseDownCanvas(e)}
          onMouseUp={(e) => this._onMouseUpCanvas(e)}
          style={this._getCanvasStyle()}
        >
          <ContextPopover
              show={true}
              position={newNodeMenuPosition}
            >
            <ContainerSelector 
              registry={registry}
              flow={flowCanvas.flow}
              engine={flowCanvas.diagramEngine}
              newNodePosition={newNodeMenuPosition}
              onRequestClose={() => this.dismissNewNodeMenu()}
            />
          </ContextPopover>
          <DiagramWidget
            diagramEngine={flowCanvas.diagramEngine} 
          />
        </div>
        <div style={this._getConfigurationTrayStyle()}>
          <NodeDetailCards 
            engine={flowCanvas.diagramEngine}
            node={selectedNode} 
          />
        </div>
        <Snackbar
          open={!!snackMessage}
          message={snackMessage || ''}
          autoHideDuration={4000}
          onRequestClose={() => dispatch(actions.setSnackMessage(null))}
        />
      </div>
    );
  }
}

export function createBuilder(
  eventHandlers: IBuilderEventHandlers,
  registry: ContainerRegistry,
) {
  FlowEngine.setRegistry(registry);
  return connect((state: IState) => {
    const flow = state.builder.getFlowClone();
    const diagramEngine = (flow) ? getDiagramEngine(flow) : null;
    let flowCanvas = {};
    if (flow && diagramEngine) {
      flowCanvas = {
        flowCanvas: {
          flow,
          diagramEngine,
        },
      };
    }
    return {
      ...eventHandlers,
      ...flowCanvas,
      registry,
      snackMessage: state.builder.snackMessage,
      selectedNode: state.builder.selectedNode,
    };
  })(PintuBuilder);
}
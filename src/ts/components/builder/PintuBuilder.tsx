import * as _ from 'lodash';
import * as React from 'react';
import * as cx from 'classnames';
import {connect, Dispatch} from 'react-redux';
import {push} from 'react-router-redux';
import {DiagramEngine, DiagramModel, DiagramWidget, LinkModel} from 'storm-react-diagrams';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {ScrollableArea} from '../ui/ScrollableArea';

import {IState} from '../../reducers';
import {actions, getDiagramEngine} from '../../reducers/builder/actions';
import {BuilderActionType} from '../../reducers/builder/common';

import {ContainerRegistry, FlowEngine, IFlow, FlowSaveResultType, IBuilderEventHandlers, IStepConfig, IFlowMetaData, IFlowMetaDataMap, EditFlowCallbackType, DeleteFlowCallbackType} from '../../lib';
import {ConfigTray} from './ConfigTray';
import {FlowList} from './FlowList';
import {ContextPopover} from '../ui/ContextPopover';
import {NodeModel} from '../ui/diagrams/NodeModel';
import {ContainerSelector} from '../ui/ContainerSelector';
import {history} from '../../lib/History';
import {safe} from '../../lib/utils';
import {style} from '../../lib/styles';

import 'storm-react-diagrams/src/sass.scss';
import '../../../scss/builder/main.scss';

interface IParams {
  flowID?: string;
}

interface IFlowCanvas {
  flow: IFlow;
  flowEngine: FlowEngine;
  diagramEngine: DiagramEngine;
}

export interface IPintuBuilderProps {
  builderUrlPrefix: string;
  runnerUrlTemplate: string;
  dispatch: Dispatch<BuilderActionType>;
  flowCanvas?: IFlowCanvas;
  flowList: IFlowMetaDataMap;
  isSavingFlow: boolean;
  onCreateFlow: (flowData: IFlowMetaData) => Promise<string>;
  onDeleteFlow: DeleteFlowCallbackType;
  onLoadFlow: (flowID: string) => Promise<IFlow>;
  onLoadFlowList: () => Promise<IFlowMetaDataMap>;
  onEditFlow: EditFlowCallbackType;
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

  private async loadFlowList() {
    const flowList = await this.props.onLoadFlowList();
    this.props.dispatch(actions.setFlowList(flowList));
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
    this.loadFlowList();
    if (flowID) {
      this.loadFlowData(flowID);
    }
  }

  componentDidUpdate(prevProps: IPintuBuilderProps) {
    if (prevProps.params.flowID && !this.props.params.flowID) {
      this.loadFlowList();
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

  private getRootStyle(): React.CSSProperties {
    return {
      display: 'flex',
      flexFlow: 'row',
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
    };
  }

  private getCanvasStyle(): React.CSSProperties {
    return {
      backgroundColor: 'rgb(60, 60, 60)',
      boxShadow: 'rgba(0, 0, 0, 0.7) 0px 0px 4px, rgba(0, 0, 0, 0.4) -4px 0px 8px',
      flex: 1,
      height: '100%',
      userSelect: 'none',
    };
  }

  private getConfigurationTrayStyle(): React.CSSProperties {
    return {
      boxSizing: 'border-box',
      flex: '0 0 auto',
      padding: 4,
      width: 450,
      height: '100%',
      position: 'absolute',
      right: 0,
      pointerEvents: 'none',
    }
  }

  private onRightClickCanvas(e: React.MouseEvent<any>) {
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

  private onMouseDownCanvas(e: React.MouseEvent<any>) {
    this.setState({
      isMovingCanvas: true,
    });
  }

  private onMouseUpCanvas(e: React.MouseEvent<any>) {
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
      isSavingFlow,
      params,
      registry,
      builderUrlPrefix,
      runnerUrlTemplate,
      snackMessage,
      selectedNode,
      onEditFlow,
      onAutoSaveFlow,
      onDeleteFlow,
    } = this.props;
    const {
      newNodeMenuPosition,
    } = this.state;

    if (params.flowID === undefined) {
      return this.renderCreateFlowForm();
    }

    if (!flowCanvas) {
      return (
        <div 
          style={{
            boxSizing: 'border-box',
            height: '100%', 
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
      <MuiThemeProvider>
        <div
          className={rootClass}
          style={this.getRootStyle()}
        >
          <div 
            onContextMenu={(e) => this.onRightClickCanvas(e)}
            onClick={() => this.dismissNewNodeMenu()}
            onMouseDown={(e) => this.onMouseDownCanvas(e)}
            onMouseUp={(e) => this.onMouseUpCanvas(e)}
            style={this.getCanvasStyle()}
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
          <div style={this.getConfigurationTrayStyle()}>
            <ConfigTray 
              builderUrlPrefix={builderUrlPrefix}
              dispatch={dispatch}
              flow={flowCanvas.flow}
              flowEngine={flowCanvas.flowEngine}
              node={selectedNode} 
              saveFlowCallback={onAutoSaveFlow}
              deleteFlowCallback={onDeleteFlow}
              isSavingFlow={isSavingFlow}
              runnerUrlTemplate={runnerUrlTemplate}
            />
          </div>
          <Snackbar
            open={!!snackMessage}
            message={snackMessage || ''}
            autoHideDuration={4000}
            onRequestClose={() => dispatch(actions.setSnackMessage(null))}
          />
        </div>
      </MuiThemeProvider>
    );
  }

  private renderCreateFlowForm() {
    const {
      flowList,
      onCreateFlow,
      builderUrlPrefix,
    } = this.props;
    return (
      <div
        style={this.getRootStyle()}
      >
        <div 
          className={cx('storm-diagrams-canvas')}
          style={{
            ...this.getCanvasStyle(),
            ...style('blur-2'),
            height: '100%',
            width: '100%',
            position: 'absolute',
          }}
        />

        <FlowList
          builderUrlPrefix={builderUrlPrefix}
          flowList={flowList}
          style={{
            borderRadius: '2px',
            backgroundColor: 'white',
            filter: 'none',
            margin: 'auto',
            position: 'relative',
            top: -50,
            width: 500,
            zIndex: 10,
          }}
          onCreateFlow={async (newFlow: IFlowMetaData) => {
            const newFlowId = await this.props.onCreateFlow(newFlow);
            const newUrl = `${this.props.builderUrlPrefix}/${newFlowId}`;
            history.replace(newUrl);
          }}
        />
      </div>
    );
  }
}

export function createBuilder(
  eventHandlers: IBuilderEventHandlers,
  registry: ContainerRegistry,
  builderUrlPrefix: string,
  runnerUrlTemplate: string,
) {
  FlowEngine.setRegistry(registry);
  return connect((state: IState) => {
    const flow = state.builder.getFlowClone();
    const flowEngine = state.builder.getFlowEngine();
    const diagramEngine = (flow) ? getDiagramEngine(flow) : null;
    let flowCanvas = {};
    if (flow && diagramEngine && flowEngine) {
      flowCanvas = {
        flowCanvas: {
          flow,
          flowEngine,
          diagramEngine,
        },
      };
    }
    return {
      ...eventHandlers,
      ...flowCanvas,
      flowList: state.builder.flowList,
      registry,
      snackMessage: state.builder.snackMessage,
      selectedNode: state.builder.selectedNode,
      builderUrlPrefix,
      isSavingFlow: state.builder.isSavingFlow,
      runnerUrlTemplate,
    };
  })(PintuBuilder);
}
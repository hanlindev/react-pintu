import * as React from 'react';
import * as cx from 'classnames';
import {connect} from 'react-redux';
import {DiagramEngine, DiagramModel, DiagramWidget} from 'storm-react-diagrams';
import CircularProgress from 'material-ui/CircularProgress';

import {IState} from '../../reducers';
import {actions} from '../../reducers/builder';
import {ContainerRegistry, FlowEngine, IFlow, FlowSaveResultType, IBuilderEventHandlers, IStepConfig, IFlowMetaData} from '../../lib';
import {push} from 'react-router-redux';

import 'storm-react-diagrams/src/sass.scss';
import '../../../scss/builder/main.scss';

interface IParams {
  flowID?: string;
}

export interface IPintuBuilderProps {
  dispatch: (action: any) => any;
  flow: IFlow | null;
  flowEngine: FlowEngine | null;
  onCreateFlow: (flowData: IFlowMetaData) => Promise<string>;
  onLoadFlow: (flowID: string) => Promise<IFlow>;
  onAutoSaveFlow: (flowData: IFlow) => Promise<FlowSaveResultType>;
  onUserSaveFlow: (flowData: IFlow) => Promise<FlowSaveResultType>;
  params: IParams;
}

interface IPintuBuilderState {
  isMovingCanvas: boolean;
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

  private async loadFlowData(flowID: string) {
    const flowData = await this.props.onLoadFlow(flowID);
    this.props.dispatch(actions.setFlow(flowData));
  }

  private async createFlow(flowData: IFlowMetaData) {
    const {dispatch, onCreateFlow} = this.props;
    const flowID = await onCreateFlow(flowData);
    dispatch(push(`/builder/${flowID}`));
  }

  private syncNewEngine(
    newFlowEngine: FlowEngine | null, 
    oldFlowEngine: FlowEngine | null,
  ) {
    const newEngine = this.getDiagramEngine(newFlowEngine);
    const {flow} = this.props;
    if (!newFlowEngine || !newEngine || !flow) {
      return;
    }

    if (newFlowEngine && newFlowEngine !== oldFlowEngine) {
      newFlowEngine.restoreFlow(flow);
    }
    const diagramEngine = this.getDiagramEngine(oldFlowEngine);
    const newModel = newEngine.getDiagramModel();
    const oldModel = diagramEngine && diagramEngine.getDiagramModel();
    if (newModel && newModel !== oldModel) {
      oldModel && oldModel.clearListeners();
      newModel.addListener({
        linksUpdated: () => {
          this.serializeDiagram();
        },
        nodesUpdated: () => {
          this.serializeDiagram();
        }
      });
    }
  }

  private serializeDiagram() {
    const diagramModel = this.getDiagramModel(this.props.flowEngine);
    if (diagramModel) {
      const serializeDiagram = JSON.stringify(diagramModel.serializeDiagram());
      this.props.dispatch(actions.setSerializedDiagram(serializeDiagram));
    }
  }

  componentDidMount() {
    const {params: {flowID}} = this.props;
    if (flowID) {
      this.loadFlowData(flowID);
    }
    this.syncNewEngine(this.props.flowEngine, null);
  }

  componentWillReceiveProps(nextProps: IPintuBuilderProps) {
    const {
      params: {flowID}, 
      flow,
      onAutoSaveFlow,
    } = nextProps;
    if (flowID && flowID !== this.props.params.flowID) {
      this.loadFlowData(flowID);
    }

    if (flow && flow !== this.props.flow) {
      onAutoSaveFlow && onAutoSaveFlow(flow);
    }
  }

  componentDidUpdate(prevProps: IPintuBuilderProps) {
    const prevFlowEngine = prevProps.flowEngine;
    this.syncNewEngine(this.props.flowEngine, prevFlowEngine);
  }

  _getRootStyle(): React.CSSProperties {
    return {
      display: 'flex',
      flexFlow: 'row',
      height: '100%',
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
      height: '100%',
      paddingTop: 4,
      paddingLeft: 4,
      width: 400,
    }
  }

  _onRightClickCanvas(e: React.MouseEvent<any>) {
    // TODO differentiate long click vs short click 
    // (so after dragging, don't show context)
    e.preventDefault();
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

  render() {
    const diagramEngine = this.getDiagramEngine(this.props.flowEngine);
    if (!diagramEngine) {
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
          onMouseDown={(e) => this._onMouseDownCanvas(e)}
          onMouseUp={(e) => this._onMouseUpCanvas(e)}
          style={this._getCanvasStyle()}
        >
          <DiagramWidget
            diagramEngine={diagramEngine} 
          />
        </div>
        <div style={this._getConfigurationTrayStyle()}>
          TODO
        </div>
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
    return {
      ...eventHandlers,
      flow: state.builder.getFlowClone(),
      flowEngine: state.builder.getFlowEngine(),
    };
  })(PintuBuilder);
}
import * as React from 'react';
import * as cx from 'classnames';
import {connect} from 'react-redux';
import {DiagramEngine, DiagramWidget} from 'storm-react-diagrams';
import CircularProgress from 'material-ui/CircularProgress';

import {IState} from '../../reducers';
import {actions} from '../../reducers/builder';
import {ContainerRegistry, FlowEngine, IFlow, IStepConfig, IFlowMetaData} from '../../lib';
import {push} from 'react-router-redux';

import 'storm-react-diagrams/src/sass.scss';
import '../../../scss/builder/main.scss';

interface IParams {
  flowID?: string;
}

export interface IPintuBuilderProps {
  diagramEngine: DiagramEngine;
  dispatch: (action: any) => any;
  onCreateFlow: (flowData: IFlowMetaData) => Promise<string>;
  onLoadFlow: (flowID: string) => Promise<IFlow>;
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

  private async loadFlowData(flowID: string) {
    const flowData = await this.props.onLoadFlow(flowID);
    this.props.dispatch(actions.loadFlow(flowData));
  }

  private async createFlow(flowData: IFlowMetaData) {
    const {dispatch, onCreateFlow} = this.props;
    const flowID = await onCreateFlow(flowData);
    dispatch(push(`/builder/${flowID}`));
  }

  componentDidMount() {
    const {params: {flowID}} = this.props;
    if (flowID) {
      this.loadFlowData(flowID);
    }
  }

  componentWillReceiveProps(nextProps: IPintuBuilderProps) {
    const {params: {flowID}} = nextProps;
    if (flowID && flowID !== this.props.params.flowID) {
      this.loadFlowData(flowID);
    }
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
  }

  render() {
    const {diagramEngine} = this.props;
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
            diagramEngine={this.props.diagramEngine} 
          />
        </div>
        <div style={this._getConfigurationTrayStyle()}>
          TODO
        </div>
      </div>
    );
  }
}

export interface IBuilderEventHandlers {
  // Given flow meta data, return a promise that resolves to the ID of the new
  // flow.
  onCreateFlow: (flowData: IFlowMetaData) => Promise<string>;
  // Given a flow ID, return a promise that resolves to the complete flow data.
  onLoadFlow: (flowID: string) => Promise<IFlow>;
}
export function createBuilder(
  eventHandlers: IBuilderEventHandlers,
  registry: ContainerRegistry,
) {
  FlowEngine.setRegistry(registry);
  return connect((state: IState) => {
    return {
      ...eventHandlers,
      diagramEngine: state.builder.getDiagramEngine(),
    };
  })(PintuBuilder);
}
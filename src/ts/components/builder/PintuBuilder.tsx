import * as React from 'react';
import * as cx from 'classnames';
import {connect} from 'react-redux';
import * as SRD from 'storm-react-diagrams';
import {DiagramWidget} from 'storm-react-diagrams';

import {IState} from '../../reducers';
import {ContainerRegistry, DiagramEngine, IStepConfig, IFlowMetaData} from '../../lib';
import {push} from 'react-router-redux';

import 'storm-react-diagrams/src/sass.scss';
import '../../../scss/builder/main.scss';

interface IParams {
  flowID?: string;
}

export interface IPintuBuilderProps {
  dispatch: (action: any) => any;
  steps: {[key: string]: IStepConfig};
  onCreateFlow: (flowData: IFlowMetaData) => Promise<string>;
  onLoadFlow: (flowID: string) => Promise<IFlow>;
  params: IParams;
}

interface IPintuBuilderState {
  isMovingCanvas: boolean;
}

class PintuBuilder extends React.Component<IPintuBuilderProps, IPintuBuilderState> {
  protected activeModel: SRD.DiagramModel;
  protected diagramEngine: SRD.DiagramEngine;

  state: IPintuBuilderState;

  constructor(props: IPintuBuilderProps) {
    super(props);

    this.newModal();
    this.state = {
      isMovingCanvas: false,
    };
  }

  private async loadFlowData(flowID: string) {
    const flowData = await this.props.onLoadFlow(flowID);
    // TODO dispatch action to set current flow data to `flowData`
  }

  private async createFlow(flowData: IFlowMetaData) {
    const {dispatch, onCreateFlow} = this.props;
    const flowID = await onCreateFlow(flowData);
    dispatch(push(`/builder/${flowID}`));
  }

  componentWillReceiveProps(nextProps: IPintuBuilderProps) {
    const {params: {flowID}} = nextProps;
    if (flowID && flowID !== this.props.params.flowID) {
      this.loadFlowData(flowID);
    }
  }

  newModal() {
    this.diagramEngine = new SRD.DiagramEngine();
		this.diagramEngine.registerNodeFactory(new SRD.DefaultNodeFactory());
		this.diagramEngine.registerLinkFactory(new SRD.DefaultLinkFactory());

    this.activeModel = new SRD.DiagramModel();
		this.diagramEngine.setDiagramModel(this.activeModel);
		
		
		var node1 = new SRD.DefaultNodeModel("Node 1","rgb(0,192,255)");
		var port1 = node1.addPort(new SRD.DefaultPortModel(false,"out-1","Out"));
		node1.x = 100;
		node1.y = 100;
    node1.addListener({
      selectionChanged: (item, isSelected) => {
      },
    });

		var node2 = new SRD.DefaultNodeModel("Node 2","rgb(192,255,0)");
		var port2 = node2.addPort(new SRD.DefaultPortModel(true,"in-1","IN"));
		node2.x = 400;
		node2.y = 100;

		var link1 = new SRD.LinkModel();
		link1.setSourcePort(port1);
		link1.setTargetPort(port2);

		this.activeModel.addNode(node1);
		this.activeModel.addNode(node2);
		this.activeModel.addLink(link1);
  }

  public getActiveDiagram(): SRD.DiagramModel{
		return this.activeModel;
	}
	
	public getDiagramEngine(): SRD.DiagramEngine{
		return this.diagramEngine;
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
    const rootClass = cx({
      'is-moving-canvas': this.state.isMovingCanvas,
    });
    // TODO use real nodes, this is just a trial.
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
            diagramEngine={this.diagramEngine} 
          />
        </div>
        <div style={this._getConfigurationTrayStyle()}>
          TODO
        </div>
      </div>
    );
  }
}

export interface IFlow {
  metaData: IFlowMetaData;
  firstStepID: string;
  steps: {[key: string]: IStepConfig};
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
  DiagramEngine.setRegistry(registry);
  return connect((state: IState) => {
    return {
      steps: state.builder.getSteps(),
      ...eventHandlers,
    };
  })(PintuBuilder);
}
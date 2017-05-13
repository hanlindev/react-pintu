import * as React from 'react';
import * as cx from 'classnames';
import {connect} from 'react-redux';
import * as SRD from 'storm-react-diagrams';
import {DiagramWidget} from 'storm-react-diagrams';

import {IState} from '../../reducers';
import {IStepConfig} from '../../reducers/builder';

import 'storm-react-diagrams/src/sass.scss';
import '../../../scss/builder/main.scss';

export interface IPintuBuilderProps {
  steps: {[key: string]: IStepConfig};
}

interface IPintuBuilderState {
  isMovingCanvas: boolean;
}

class _PintuBuilder extends React.Component<IPintuBuilderProps, IPintuBuilderState> {
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
        console.log({item, isSelected});//fd
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
      flex: '0 0 auto',
      height: '100%',
      paddingLeft: 4,
      width: 400,
    }
  }

  _onActionStart(action: SRD.BaseAction): boolean {
    return false; // TODO figure out what it is
  }

  _onRightClickCanvas(e: React.MouseEvent<any>) {
    // TODO differentiate long click vs short click 
    // (so after dragging, don't show context)
    e.preventDefault();
  }

  _onMouseDownCanvas(e: React.MouseEvent<any>) {
    if (e.nativeEvent.which === 3) {
      this.setState({
        isMovingCanvas: true,
      });
      // TODO style the cursor
    }
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

export const PintuBuilder = connect((state: IState) => {
  return {
    steps: state.builder.getSteps(),
  };
})(_PintuBuilder);
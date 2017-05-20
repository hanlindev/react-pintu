import * as _ from 'lodash';
import {actions, BuilderActionType} from '../../../reducers/builder';
import {DiagramEngine, DiagramModel, DiagramEngineListener, DiagramListener as DiagramModelListener, LinkModel} from 'storm-react-diagrams';
import {Dispatch} from 'react-redux';
import {LinkListener} from './LinkListener';
import {LinkAdded} from '../../../lib/FlowEngine/events/LinkAdded';

export class DiagramListener implements DiagramModelListener, DiagramEngineListener {
  static singleInstance: DiagramListener;

  private diagram: DiagramModel;

  private constructor(
    readonly diagramEngine: DiagramEngine,
    readonly dispatch: Dispatch<BuilderActionType>,
  ) {
    this.diagram = diagramEngine.getDiagramModel();
    this.diagramEngine.addListener(this);
    this.diagram.addListener(this);
  }

  private serializeDiagram() {
    const serialized = JSON.stringify(this.diagram.serializeDiagram());
    this.dispatch(actions.setSerializedDiagram(serialized));
  }

  nodesUpdated?(node: any, isCreated: boolean): void {
  }

  linksUpdated?(link: LinkModel, isCreated: boolean): void {
    link.clearListeners();
    link.addListener(new LinkListener(link, this.dispatch));
    _.defer(() => {
      this.dispatch(actions.handleLinkChange(new LinkAdded(link)));
    });
  }

  offsetUpdated?(model: DiagramModel, offsetX: number, offsetY: number): void {

  }

  zoomUpdated?(model: DiagramModel, zoom: number): void {

  }

  nodeFactoriesUpdated?(): void {

  }

  linkFactoriesUpdated?(): void {

  }

  repaintCanvas?(): void {
  }

  static register(
    engine: DiagramEngine,
    dispatch: Dispatch<BuilderActionType>,
  ) {
    DiagramListener.singleInstance = new DiagramListener(engine, dispatch);

  }
}
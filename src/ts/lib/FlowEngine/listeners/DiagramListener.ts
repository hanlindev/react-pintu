import * as _ from 'lodash';
import {DiagramEngine, DiagramModel, DiagramEngineListener, DiagramListener as DiagramModelListener, LinkModel} from 'storm-react-diagrams';
import {Dispatch} from 'react-redux';
import {LinkListener} from './LinkListener';
import {NodeListener} from './NodeListener';
import {IDiagramChange} from '../interfaces';
import {LinkAdded, LinkRemoved, NodeAdded, NodeRemoved, NodeSourceRemoved} from '../builderEvents';
import {NodeModel, ActionPortModel} from '../../../components/ui/diagrams';

export interface IDiagramEvents {
  onDiagramChange: (linkChange: IDiagramChange) => any;
  onSerializeDiagram: (serialized: string) => any;
  onSelectionChange: (node: NodeModel) => any;
}

export class DiagramListener implements DiagramModelListener, DiagramEngineListener {
  static singleInstance: DiagramListener;

  private diagram: DiagramModel;

  private constructor(
    readonly diagramEngine: DiagramEngine,
    readonly events: IDiagramEvents,
  ) {
    this.diagram = diagramEngine.getDiagramModel();
    this.diagramEngine.addListener(this);
    this.diagram.addListener(this);
  }

  private serializeDiagram() {
    const serialized = JSON.stringify(this.diagram.serializeDiagram());
    this.events.onSerializeDiagram(serialized);
  }

  nodesUpdated?(node: NodeModel, isCreated: boolean): void {
    if (isCreated) {
      node.addListener(new NodeListener(node, this.events));
      this.events.onDiagramChange(new NodeAdded(node));
    } else {
      node.clearListeners();
      this.events.onDiagramChange(new NodeRemoved(node));
    }
  }

  linksUpdated?(link: LinkModel, isCreated: boolean): void {
    if (isCreated) {
      link.addListener(new LinkListener(link, this.events));
      _.defer(() => {
        this.events.onDiagramChange(new LinkAdded(link));
      });
    } else {
      link.clearListeners();
      _.defer(() => {
        this.events.onDiagramChange(new LinkRemoved(link));
        const srcPort = link.getSourcePort() as ActionPortModel;
        const targetPort = link.getTargetPort();
        if (srcPort && targetPort) {
          const targetNode = targetPort.getParent() as NodeModel;
          this.events.onDiagramChange(
            new NodeSourceRemoved(targetNode, link),
           );
        }
      })
    }
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
    events: IDiagramEvents,
  ) {
    DiagramListener.singleInstance = new DiagramListener(engine, events);
    const model = engine.getDiagramModel();
    _.forEach(model.getNodes(), (node: NodeModel) => {
      node.addListener(new NodeListener(node, events));
    });
  }
}
import * as _ from 'lodash';
import {DefaultLinkFactory, DiagramEngine as SRDDiagramEngine, DiagramModel, LinkModel} from 'storm-react-diagrams';
import {PintuNodeWidgetFactory} from '../components/ui/diagrams/PintuNodeWidget';
import {PintuNodeModel, PintuNodeInstanceFactory} from '../components/ui/diagrams/PintuNodeModel';
import {PintuActionPortModel} from '../components/ui/diagrams/PintuActionPortModel';
import {ContainerRegistry} from './ContainerRegistry';
import {IStepConfig, IFlow} from './interfaces';

export class FlowEngine {
  static engines: {[id: string]: FlowEngine} = {};
  static registry: ContainerRegistry;

  stepNodes: {[id: string]: PintuNodeModel} = {};
  engineImpl: SRDDiagramEngine;
  diagramModel: DiagramModel;

  get diagramEngine(): SRDDiagramEngine {
    return this.engineImpl;
  }
  
  private constructor(private id: string) {
    if (FlowEngine.engines[id]) {
      throw new TypeError(`Duplicate engine found for id - ${id}`);
    }

    this.engineImpl = new SRDDiagramEngine();
    this.engineImpl.registerInstanceFactory(new PintuNodeInstanceFactory());
    this.engineImpl.registerNodeFactory(new PintuNodeWidgetFactory());
    this.engineImpl.registerLinkFactory(new DefaultLinkFactory());
    
    this.diagramModel = new DiagramModel();
    this.engineImpl.setDiagramModel(this.diagramModel);
  }

  static getEngine(flow: IFlow): FlowEngine {
    const id = flow.metaData.flowID;
    if (!FlowEngine.engines[id]) {
      const newEngine = new FlowEngine(id);
      newEngine.restoreFlow(flow);
      FlowEngine.engines[id] = new FlowEngine(id);
    }
    return FlowEngine.engines[id];
  }

  static setRegistry(registry: ContainerRegistry) {
    if (registry !== FlowEngine.registry) {
      // If this is a new registry, the views will change. The existing
      // engines will probably be obsolete.
      FlowEngine.engines = {};
      FlowEngine.registry = registry;
    }
  }

  private buildNode(step: IStepConfig) {
    const container = FlowEngine.registry.getContainer(step.containerName);
    const node = new PintuNodeModel(step, container);
    // TODO position the node if not automatically positioned.
    return node;
  }

  private enforceNode(stepId: string): PintuNodeModel {
    const result = this.stepNodes[stepId];
    if (!result) {
      throw new TypeError(`Node for step with ID - ${stepId} not found`);
    }
    return result;
  }

  /**
   * @returns true if the step is inserted; false otherwise
   */
  insertStep(step: IStepConfig): boolean {
    if (!this.stepNodes[step.id]) {
      const node = this.buildNode(step);
      // fd section
      node.x = 500;
      node.y = 400;
      // end fd section
      this.stepNodes[step.id] = node;
      this.diagramModel.addNode(node);
      return true;
    } else {
      return false;
    }
  }

  restoreLinks(destNode: PintuNodeModel) {
    _.forEach(this.stepNodes, (node) => {
      Object.keys(node.config.destinations).forEach((actionName: string) => {
        node.tryRestoreLink(actionName, destNode, this.diagramModel);
      });
    });
  }

  restoreFlow(flow: IFlow) {
    const {
      steps,
      serializedDiagram,
    } = flow;
    if (serializedDiagram) {
      // This only adds the nodes to the diagramModel, not FlowEngine.
      // So get the nodes from the model and set to the engine.
      this.diagramModel.deSerializeDiagram(
        JSON.parse(serializedDiagram), 
        this.engineImpl
      );
      this.stepNodes = 
        this.diagramModel.getNodes() as {[key: string]: PintuNodeModel};
      // Links are restored by the engine, no need to call this.restoreLinks.
    } else {
      _.forEach(steps, (step) => {
        this.insertStep(step);
      });
      _.forEach(this.stepNodes, (step) => {
        this.restoreLinks(step);
      });
    }
    console.log(this);//fd
    this.diagramEngine.repaintCanvas();
  }
}
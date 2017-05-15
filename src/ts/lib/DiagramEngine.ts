import {DefaultLinkFactory, DiagramEngine as SRDDiagramEngine, DiagramModel} from 'storm-react-diagrams';
import {PintuNodeFactory} from '../components/builder/diagrams/PintuNodeFactory';
import {PintuNodeModel} from '../components/builder/diagrams/PintuNodeModel';
import {ContainerRegistry} from './ContainerRegistry';
import {IStepConfig} from './interfaces';

export class DiagramEngine {
  static engines: {[id: string]: DiagramEngine} = {};
  static registry: ContainerRegistry;

  stepNodes: {[id: string]: PintuNodeModel} = {};
  engineImpl: SRDDiagramEngine;
  model: DiagramModel;
  
  private constructor(private id: string) {
    if (DiagramEngine.engines[id]) {
      throw new TypeError(`Duplicate engine found for id - ${id}`);
    }

    this.engineImpl = new SRDDiagramEngine();
    this.engineImpl.registerNodeFactory(new PintuNodeFactory());
    this.engineImpl.registerLinkFactory(new DefaultLinkFactory());

    this.model = new DiagramModel();
    this.engineImpl.setDiagramModel(this.model);
  }

  static getEngine(id: string): DiagramEngine {
    if (!DiagramEngine.engines[id]) {
      DiagramEngine.engines[id] = new DiagramEngine(id);
    }

    return DiagramEngine.engines[id];
  }

  private getNode(step: IStepConfig) {
    const container = DiagramEngine.registry.getContainer(step.containerName);
    const node = new PintuNodeModel(step, container);
    // TODO position the node if not automatically positioned.
    return node;
  }

  /**
   * @returns true if the step is inserted; false otherwise
   */
  insertStep(step: IStepConfig): boolean {
    if (!this.stepNodes[step.id]) {
      const node = this.getNode(step);
      this.stepNodes[step.id] = node;
      this.model.addNode(node);
      // TODO setup link
      return true;
    } else {
      return false;
    }
  }

  static setRegistry(registry: ContainerRegistry) {
    if (registry !== DiagramEngine.registry) {
      // If this is a new registry, the views will change. The existing
      // engines will probably be obsolete.
      DiagramEngine.engines = {};
      DiagramEngine.registry = registry;
    }
  }
}
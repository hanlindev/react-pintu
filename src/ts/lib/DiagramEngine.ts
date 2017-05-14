import {DefaultLinkFactory, DiagramEngine as SRDDiagramEngine, DiagramModel} from 'storm-react-diagrams';
import {PintuNodeFactory} from '../components/builder/diagrams/PintuNodeFactory';
import {ContainerRegistry} from './ContainerRegistry';
import {IStepConfig} from './interfaces';

export class DiagramEngine {
  static engines: {[id: string]: DiagramEngine} = {};
  static registry: ContainerRegistry;

  steps: {[name: string]: IStepConfig} = {};
  engineImpl: SRDDiagramEngine;
  model: DiagramModel;
  
  private constructor(id: string) {
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

  // TODO 1. implement step to node conversion
  // TODO 2. implement add new step

  static setRegistry(registry: ContainerRegistry) {
    if (registry !== DiagramEngine.registry) {
      // If this is a new registry, the views will change. The existing
      // engines will probably be obsolete.
      DiagramEngine.engines = {};
      DiagramEngine.registry = registry;
    }
  }
}
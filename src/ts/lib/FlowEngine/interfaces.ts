import {DiagramEngine, DiagramModel, PortModel, LinkModel} from 'storm-react-diagrams';
import {NodeModel} from '../../components/ui/diagrams/NodeModel';
import {IStepConfigMapChange} from '../interfaces/flow';
import {WireablePortType} from '../../components/ui/diagrams';
import {BaseContainer} from '../BaseContainer';

export interface IFlowEngine {
  clearLinks(port: PortModel, exceptIds: Array<string>): void;
  getFirstLink(port: PortModel): LinkModel | null;
  // Get the reference of the node model so the link change
  // event can modify the data.
  getNodeRef(stepID: string): NodeModel;
  getNodeRef(port: PortModel): NodeModel;
  getOnlyLink(port: PortModel): LinkModel | null;
  hasNode(stepID: string): boolean;
  hasNode(port: PortModel): boolean;
  repaintCanvas(): void;
  getDiagramEngine(): DiagramEngine;
  getDiagramModel(): DiagramModel;
  getContainer(name: string): BaseContainer;
  clearLinks(port: PortModel, exceptIds: Array<string>): void;
}

export interface IDiagramChange {
  /**
   * Modifies the engine to contain the latest step grap and
   * return the modified step configs.
   * 
   * @returns The changed step configs as a map: id -> config.
   */
  accept(engine: IFlowEngine): IStepConfigMapChange;
  getInvalidReason(): string | null;
  validate(engine: IFlowEngine): boolean;
  reject(engine: IFlowEngine): void;
}

/**
 * Diagram triggers trigger storm-react-diagram events.
 */
export interface IDiagramTrigger {
  trigger(engine: DiagramEngine): void;
}
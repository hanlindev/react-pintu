import {DiagramEngine, DiagramModel, PortModel} from 'storm-react-diagrams';
import {PintuNodeModel} from '../../components/ui/diagrams/PintuNodeModel';
import {IStepConfig} from '../interfaces/flow';
import {PintuWireablePortType} from '../../components/ui/diagrams';

export interface IFlowEngine {
  // Get the reference of the node model so the link change
  // event can modify the data.
  getNodeRef(stepID: string): PintuNodeModel;
  getNodeRef(port: PortModel): PintuNodeModel;
  repaintCanvas(): void;
  getDiagramEngine(): DiagramEngine;
  getDiagramModel(): DiagramModel;
}

export interface IDiagramChange {
  /**
   * Modifies the engine to contain the latest step grap and
   * return the modified step configs.
   * 
   * @returns The changed step configs as a map: id -> config.
   */
  accept(engine: IFlowEngine): {[key: string]: IStepConfig};
  isValid(engine: IFlowEngine): boolean;
  reject(engine: IFlowEngine): void;
}
import {NodeModel, INodeModelListeners} from '../../../components/ui/diagrams';
import {NodeConfigChanged} from '../builderEvents';
import {IDiagramChange} from '../interfaces';
import {IStepConfig} from '../../interfaces';

const DOUBLE_CLICK_INTERVAL = 300;

export interface INodeEvents {
  onDiagramChange: (change: IDiagramChange) => any;
  onSelectionChange: (node: NodeModel | null) => any;
}

export class NodeListener implements INodeModelListeners {
  prevClickTime: number = Date.now();
  previouslySelected: boolean = false;

  constructor(
    readonly node: NodeModel,
    readonly events: INodeEvents,
  ) {
    this.previouslySelected = node.isSelected();
  }

  isDoubleClick() {
    const currentTime = Date.now();
    let result = false;
    if (currentTime - this.prevClickTime < DOUBLE_CLICK_INTERVAL) {
      result = true;
    }
    this.prevClickTime = currentTime;
    return result;
  }

  selectionChanged = (item: NodeModel, isSelected: boolean) => {
    let selectedNode = null;
    if (isSelected && (this.previouslySelected || this.isDoubleClick())) {
      this.previouslySelected = true;
      selectedNode = item;
    } else {
      this.previouslySelected = false;
    }
    this.events.onSelectionChange(selectedNode);
  }

  entityRemoved(item: any): void {
  }

  nodeConfigChanged = (node: NodeModel, config: IStepConfig) => {
    this.events.onDiagramChange(new NodeConfigChanged(node, config));
  };
}
import {BaseModelListener} from 'storm-react-diagrams';
import {NodeModel} from '../../../components/ui/diagrams';

const DOUBLE_CLICK_INTERVAL = 300;

export interface INodeEvents {
  onSelectionChange: (node: NodeModel | null) => void;
}

export class NodeListener implements BaseModelListener {
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
}
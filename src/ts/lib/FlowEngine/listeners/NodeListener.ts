import {BaseModelListener} from 'storm-react-diagrams';
import {NodeModel} from '../../../components/ui/diagrams';

export interface INodeEvents {
  onSelectionChange: (node: NodeModel | null) => void;
}

export class NodeListener implements BaseModelListener {
  constructor(
    readonly node: NodeModel,
    readonly events: INodeEvents,
  ) {}

  selectionChanged(item: NodeModel, isSelected: boolean): void {
    this.events.onSelectionChange((isSelected) ? this.node : null);
  }

  entityRemoved(item: any): void {
  }
}
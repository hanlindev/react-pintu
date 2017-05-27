import {LinkModel, LinkModelListener} from 'storm-react-diagrams';
import {Dispatch} from 'react-redux';
import {WireablePortType, NodeModel, EntrancePortModel} from '../../../components/ui/diagrams';
import {IDiagramChange} from '../interfaces';
import {LinkTargetPortChanged, NodeSourceChanged} from '../builderEvents';

export interface ILinkEvents {
  onDiagramChange: (change: IDiagramChange) => void;
}

export class LinkListener implements LinkModelListener {
  private srcPort: WireablePortType | null;
  private targetPort: WireablePortType | null;

  constructor(
    readonly link: LinkModel,
    readonly events: ILinkEvents,
  ) {
    this.srcPort = link.sourcePort as WireablePortType;
    this.targetPort = link.targetPort as WireablePortType;
  }

  sourcePortChanged?(
    item: LinkModel, 
    target: null | WireablePortType,
  ): void {
  }

  targetPortChanged?(item: LinkModel, target: null | WireablePortType) {
    this.events.onDiagramChange(new LinkTargetPortChanged(item));
    if (target instanceof EntrancePortModel) {
      const targetNode = target.getParent() as NodeModel;
      this.events.onDiagramChange(new NodeSourceChanged(targetNode, item));
    }
  }
}
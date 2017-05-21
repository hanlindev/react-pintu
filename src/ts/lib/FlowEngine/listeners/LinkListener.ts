import {LinkModel, LinkModelListener} from 'storm-react-diagrams';
import {Dispatch} from 'react-redux';
import {PintuWireablePortType} from '../../../components/ui/diagrams';
import {IDiagramChange} from '../interfaces';
import {LinkTargetPortChanged} from '../events/LinkPortChanged';

export interface ILinkEvents {
  onDiagramChange: (change: IDiagramChange) => void;
}

export class LinkListener implements LinkModelListener {
  private srcPort: PintuWireablePortType | null;
  private targetPort: PintuWireablePortType | null;

  constructor(
    readonly link: LinkModel,
    readonly events: ILinkEvents,
  ) {
    this.srcPort = link.sourcePort as PintuWireablePortType;
    this.targetPort = link.targetPort as PintuWireablePortType;
    link.clearListeners();
    link.addListener(this);
  }

  sourcePortChanged?(
    item: LinkModel, 
    target: null | PintuWireablePortType,
  ): void {
    // TODO dispatch linkSourceChanged action.
  }

  targetPortChanged?(item: LinkModel, target: null | PintuWireablePortType) {
    this.events.onDiagramChange(new LinkTargetPortChanged(item));
  }
}
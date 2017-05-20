import {LinkModel, LinkModelListener} from 'storm-react-diagrams';
import {Dispatch} from 'react-redux';
import {BuilderActionType} from '../../../reducers/builder';
import {PintuWireablePortType} from '../../ui/diagrams';

export class LinkListener implements LinkModelListener {
  private srcPort: PintuWireablePortType | null;
  private targetPort: PintuWireablePortType | null;

  constructor(
    readonly link: LinkModel, 
    readonly dispatch: Dispatch<BuilderActionType>
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

  targetPortChanged?(item: LinkModel, target: null | PintuWireablePortType): void {
    // TODO dispatch linkTargetChanged action.
  }
}
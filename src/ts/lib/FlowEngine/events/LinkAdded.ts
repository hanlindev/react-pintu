import * as _ from 'lodash';
import {LinkModel} from 'storm-react-diagrams';
import {IDiagramChange, IFlowEngine} from '../interfaces';
import {IStepConfig} from '../../interfaces/flow';
import {PintuNodeModel} from '../../../components/ui/diagrams/PintuNodeModel';
import {PintuActionPortModel} from '../../../components/ui/diagrams/PintuActionPortModel';
import {PintuWireablePortType} from '../../../components/ui/diagrams';
import {PintuEntrancePortModel} from '../../../components/ui/diagrams/PintuEntrancePortModel';

/**
 * Accept this change means:
 * 1. Remove all other links from the same source port.
 * 2. Allow the user to continue linking to a target port.
 * Expected next change LinkPortChanged(target).
 * 
 * Reject this change means:
 * Remove the current link, preventing all future changes.
 */
export class LinkAdded implements IDiagramChange {
  private src: PintuActionPortModel | null;

  constructor(private link: LinkModel) {
    const src = link.getSourcePort();
    if (src instanceof PintuActionPortModel) {
      this.src = src;
    }
  }

  isValid(engine: IFlowEngine): boolean {
    return !!this.src;
  }

  private get srcNode(): PintuNodeModel | null {
    if (this.src !== null) {
      return this.src.getParent() as PintuNodeModel;
    }
    return null;
  }

  accept(engine: IFlowEngine): {[key: string]: IStepConfig} {
    const {src} = this;
    const result: {[key: string]: IStepConfig} = {};
    if (src) {
      const srcLinks = src.getLinks();
      _.forEach(srcLinks, (link, linkID: string) => {
        linkID !== this.link.getID() && this.removeLink(engine, link);
      });
    }
    return result;
  }

  reject(engine: IFlowEngine) {
    this.removeLink(engine, this.link);
  }

  private removeLink(engine: IFlowEngine, link: LinkModel) {
    const diagram = engine.getDiagramEngine();
    diagram.getDiagramModel().removeLink(link);
  }
}
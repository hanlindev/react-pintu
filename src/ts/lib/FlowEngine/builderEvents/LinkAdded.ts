import * as _ from 'lodash';
import {LinkModel} from 'storm-react-diagrams';
import {IDiagramChange, IFlowEngine} from '../interfaces';
import {IStepConfig} from '../../interfaces/flow';
import {NodeModel} from '../../../components/ui/diagrams/NodeModel';
import {ActionPortModel, OutputPortModel} from '../../../components/ui/diagrams';
import {WireablePortType} from '../../../components/ui/diagrams';
import {EntrancePortModel} from '../../../components/ui/diagrams/EntrancePortModel';

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
  private src: ActionPortModel | OutputPortModel | null;
  private invalidReason: string | null = null;

  constructor(private link: LinkModel) {
    const src = link.getSourcePort();
    if (
      src instanceof ActionPortModel
      || src instanceof OutputPortModel
     ) {
      this.src = src;
    }
  }

  validate(engine: IFlowEngine): boolean {
    const result = !!this.src;
    if (!result) {
      this.invalidReason =
        'Link must come out of action or output port';
    }
    return result;
  }

  getInvalidReason() {
    return this.invalidReason;
  }

  private get srcNode(): NodeModel | null {
    if (this.src !== null) {
      return this.src.getParent() as NodeModel;
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
    link.remove();
    diagram.getDiagramModel().removeLink(link);
  }
}
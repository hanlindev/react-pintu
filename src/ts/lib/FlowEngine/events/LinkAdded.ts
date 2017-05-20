import * as _ from 'lodash';
import {LinkModel} from 'storm-react-diagrams';
import {ILinkChange, IFlowEngine} from '../interfaces';
import {IStepConfig} from '../../interfaces/flow';
import {PintuNodeModel} from '../../../components/ui/diagrams/PintuNodeModel';
import {PintuActionPortModel} from '../../../components/ui/diagrams/PintuActionPortModel';
import {PintuWireablePortType} from '../../../components/ui/diagrams';
import {PintuEntrancePortModel} from '../../../components/ui/diagrams/PintuEntrancePortModel';

export class LinkAdded implements ILinkChange {
  private src: PintuActionPortModel | null;
  private target: PintuEntrancePortModel | null;

  constructor(private link: LinkModel) {
    const src = link.getSourcePort();
    const target = link.getTargetPort();
    if (src instanceof PintuActionPortModel) {
      this.src = src;
    }

    if (target instanceof PintuEntrancePortModel) {
      this.target = target;
    }
  }

  isValid(engine: IFlowEngine): boolean {
    return this.src !== null || this.target !== null;
  }

  private get srcNode(): PintuNodeModel | null {
    if (this.src !== null) {
      return this.src.getParent() as PintuNodeModel;
    }
    return null;
  }

  private get targetNode(): PintuNodeModel | null {
    if (this.target !== null) {
      return this.target.getParent() as PintuNodeModel;
    }
    return null;
  }

  private getNode(port: PintuWireablePortType): PintuNodeModel {
    return port.getParent() as PintuNodeModel;
  }

  accept(engine: IFlowEngine): {[key: string]: IStepConfig} {
    const {src, target} = this;
    const result: {[key: string]: IStepConfig} = {};
    if (src) {
      const srcLinks = src.getLinks();
      _.forEach(srcLinks, (link, linkID: string) => {
        linkID !== this.link.getID() && src.removeLink(link);
      });

      if (target) {
        const srcNode = this.getNode(src);
        const targetNode = this.getNode(target);
        srcNode.config.destinations[src.action.id] = {
          type: 'step',
          stepID: targetNode.config.id,
        };
        result[srcNode.config.id] = srcNode.config;
      }
    }
    engine.repaintCanvas();
    return result;
  }

  reject(engine: IFlowEngine) {
    this.link.remove();
  }
}
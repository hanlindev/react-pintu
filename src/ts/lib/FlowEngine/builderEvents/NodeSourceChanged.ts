import * as _ from 'lodash';
import {LinkModel} from 'storm-react-diagrams';
import {IDiagramChange, IFlowEngine} from '../interfaces';
import {IStepConfigMapChange, ISourceSpec} from '../../interfaces/flow';
import {NodeModel} from '../../../components/ui/diagrams/NodeModel';
import {ActionPortModel} from '../../../components/ui/diagrams/ActionPortModel';
import {ActionPayloadMultiplexer} from '../../containers/ActionPayloadMultiplexer';
import {BaseContainer} from '../../BaseContainer';

export class NodeSourceChanged implements IDiagramChange {
  private invalidMessage: string | null = null;

  constructor(
    readonly node: NodeModel,
    readonly link: LinkModel,
  ) {}

  validate(engine: IFlowEngine): boolean {
    const srcPort = this.link.getSourcePort();
    const srcIsAction = srcPort instanceof ActionPortModel;
    if (!srcIsAction) {
      this.invalidMessage = 'Source port is not an action port';
      return false;
    }
    return true;
  }

  getInvalidReason(): string | null {
    return this.invalidMessage;
  }

  private getSourcePort(): ActionPortModel {
    return this.link.getSourcePort() as ActionPortModel;
  }

  accept(engine: IFlowEngine): IStepConfigMapChange {
    const thisContainer = engine.getContainer(this.node.config.containerName);
    if (thisContainer instanceof ActionPayloadMultiplexer) {
      return this.acceptForMultiplexer(engine, thisContainer);
    }
    return this.acceptForNormalContainer(engine, thisContainer);
  }

  acceptForMultiplexer(
    engine: IFlowEngine,
    container: BaseContainer,
  ): IStepConfigMapChange {
    const srcPort = this.getSourcePort();
    const srcNode = engine.getNodeRef(srcPort);
    const entrancePort = this.node.getEntrancePortModel();
    const diagramModel = engine.getDiagramModel();
    const incomingLinks = entrancePort.getLinks();
    _.forEach(incomingLinks, (link) => {
      if (link !== this.link) {
        link.remove();
        diagramModel.removeLink(link);
        entrancePort.removeLink(link);
      }
    });
    const config = this.node.config;
    this.node.config.sources = [{
      linkID: this.link.getID(),
      stepID: srcNode.config.id,
      containerName: srcNode.config.containerName,
      actionID: srcPort.action.id,
    }];

    _.forEach(srcPort.action.payload, (type, name: string) => {
      this.node.addOutputPort(name, type, this.link.getID());
    });
    return {
      [this.node.config.id]: this.node.config,
    };
  }

  acceptForNormalContainer(
    engine: IFlowEngine, 
    container: BaseContainer
  ): IStepConfigMapChange {
    const srcPort = this.getSourcePort();
    const srcNode = engine.getNodeRef(srcPort);
    const config = this.node.config;
    const sources = this.node.config.sources || [];
    const newSrcSpec: ISourceSpec = {
      linkID: this.link.getID(),
      stepID: srcNode.config.id,
      containerName: srcNode.config.containerName,
      actionID: srcPort.action.id,
    };

    if (!sources.find((source) => _.isEqual(source, newSrcSpec))) {
      sources.push(newSrcSpec);
      this.node.config.sources = sources;
    }
    return {
      [this.node.config.id]: this.node.config,
    };
  }

  reject(engine: IFlowEngine) {
    const diagramModel = engine.getDiagramModel();
    this.link.remove();
    diagramModel.removeLink(this.link);
  }
}
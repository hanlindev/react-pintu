import {LinkModel, PortModel} from 'storm-react-diagrams';
import {IDiagramChange, IFlowEngine} from '../interfaces';
import {IStepConfigMapChange} from '../../interfaces/flow';
import {BasePortModel, OutputPortModel, ActionPortModel, WireablePortType} from '../../../components/ui/diagrams';
import {NodeModel} from '../../../components/ui/diagrams/NodeModel';
import {EntrancePortModel} from '../../../components/ui/diagrams/EntrancePortModel';
import {InputPortModel} from '../../../components/ui/diagrams/InputPortModel';

type LinkPortType = 'action' | 'entrance' | 'input';

abstract class LinkPortChanged implements IDiagramChange {
  protected _port: WireablePortType;
  protected invalidReason: string | null = null;

  constructor(readonly link: LinkModel, readonly type: LinkPortType) {
    switch (type) {
      case 'action':
        this._port = link.getSourcePort() as WireablePortType;
        break;
      case 'entrance':
      case 'input':
        this._port = link.getTargetPort() as WireablePortType;
        break;
      default:
        throw new TypeError(`Unrecognized type '${type}'.`);
    }
  }

  validate(engine: IFlowEngine) {
    const {type, _port} = this;
    if (type === 'action' && !(_port instanceof ActionPortModel)) {
      this.invalidReason =
        "A link must come out of an action port.";
      return false;
    }

    if (type === 'entrance' && !(_port instanceof EntrancePortModel)) {
      this.invalidReason =
        "An entrance link's destination must be an entrance port";
      return false;
    }

    if (type === 'input' && !(_port instanceof InputPortModel)) {
      this.invalidReason =
        "An input link's destination must be an input port";
      return false;
    }

    return true;
  }

  getInvalidReason() {
    return this.invalidReason;
  }

  abstract accept(engine: IFlowEngine): IStepConfigMapChange;
  abstract reject(engine: IFlowEngine): void;
}

// At this moment, source change is impossible because the user is forbidden
// to create a link from a target port. When this is support, we need to
// implement LinkSourcePortChanged event.

/**
 * Accept means:
 * 1. The source node's action's destination will be set to the new step ID.
 * 2. The link's target port will remain the same.
 * 
 * Reject means:
 * Remove this link.
 */
export class LinkTargetPortChanged extends LinkPortChanged {
  public get port(): EntrancePortModel {
    return this._port as EntrancePortModel;
  }

  constructor(link: LinkModel) {
    super(
      link, 
      (link.getTargetPort() as BasePortModel).portType as LinkPortType,
    );
  }

  getNode(port: PortModel) {
    return port.getParent() as NodeModel;
  }

  validate(engine: IFlowEngine) {
    if (!super.validate(engine)) {
      return false;
    }

    const srcPort = this.link.getSourcePort();
    if (
      srcPort instanceof OutputPortModel
      && this.port instanceof EntrancePortModel
    ) {
      this.invalidReason =
        'An output port must be connected with an input port';
      return false;
    }

    if (
      srcPort instanceof ActionPortModel
      && this.port instanceof InputPortModel
    ) {
      this.invalidReason =
        'An action port must be connected with an entrance port';
      return false;
    }

    if (
      srcPort instanceof OutputPortModel
      && this.port instanceof InputPortModel
      && !srcPort.type().isEqual(this.port.type())
    ) {
      this.invalidReason =
        "Output's and input's types must be the same";
      return false;
    }

    return true;
  }

  accept(engine: IFlowEngine): IStepConfigMapChange {
    if (this.port instanceof EntrancePortModel) {
      return this.acceptForEntrance(engine);
    }

    return this.acceptForInput(engine);
  }

  acceptForEntrance(engine: IFlowEngine): IStepConfigMapChange {
    const result: IStepConfigMapChange = {};
    const srcPort = this.link.getSourcePort() as ActionPortModel;
    const srcStep = this.getNode(this.link.getSourcePort());
    const targetStep = this.getNode(this.port);
    srcStep.config.destinations[srcPort.action.id] = {
      type: 'step',
      stepID: targetStep.config.id,
    };
    result[srcStep.config.id] = srcStep.config;
    return result;
  }

  acceptForInput(engine: IFlowEngine): IStepConfigMapChange {
    return {};
  }

  reject(engine: IFlowEngine) {
    const diagramModel = engine.getDiagramModel();
    diagramModel.removeLink(this.link);
  }
}
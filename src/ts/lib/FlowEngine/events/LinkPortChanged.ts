import {LinkModel, PortModel} from 'storm-react-diagrams';
import {IDiagramChange, IFlowEngine} from '../interfaces';
import {IStepConfigMap} from '../../interfaces/flow';
import {PintuWireablePortType} from '../../../components/ui/diagrams';
import {PintuNodeModel} from '../../../components/ui/diagrams/PintuNodeModel';
import {PintuActionPortModel} from '../../../components/ui/diagrams/PintuActionPortModel';
import {PintuEntrancePortModel} from '../../../components/ui/diagrams/PintuEntrancePortModel';

type LinkPortType = 'action' | 'entrance';

abstract class LinkPortChanged implements IDiagramChange {
  protected _port: PintuWireablePortType;

  constructor(readonly link: LinkModel, readonly type: LinkPortType) {
    switch (type) {
      case 'action':
        this._port = link.getSourcePort() as PintuWireablePortType;
        break;
      case 'entrance':
        this._port = link.getTargetPort() as PintuWireablePortType;
        break;
      default:
        throw new TypeError(`Unrecognized type '${type}'.`);
    }
  }

  isValid(engine: IFlowEngine) {
    const {type, _port} = this;
    return (
      (type === 'action' && _port instanceof PintuActionPortModel)
      || (type === 'entrance' && _port instanceof PintuEntrancePortModel)
    );
  }

  abstract accept(engine: IFlowEngine): IStepConfigMap;
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
  public get port(): PintuEntrancePortModel {
    return this._port as PintuEntrancePortModel;
  }

  constructor(link: LinkModel) {
    super(link, 'entrance');
  }

  getNode(port: PortModel) {
    return port.getParent() as PintuNodeModel;
  }

  accept(engine: IFlowEngine): IStepConfigMap {
    const result: IStepConfigMap = {};
    const srcPort = this.link.getSourcePort() as PintuActionPortModel;
    const srcStep = this.getNode(this.link.getSourcePort());
    const targetStep = this.getNode(this.port);
    srcStep.config.destinations[srcPort.action.id] = {
      type: 'step',
      stepID: targetStep.config.id,
    };
    result[srcStep.config.id] = srcStep.config;
    return result;
  }

  reject(engine: IFlowEngine) {
    const diagramModel = engine.getDiagramModel();
    diagramModel.removeLink(this.link);
  }
}
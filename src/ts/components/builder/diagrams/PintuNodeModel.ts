import * as _ from 'lodash';
import {NodeModel, PortModel} from 'storm-react-diagrams';
import {PintuInputPortModel} from './PintuInputPortModel';
import {PintuActionPortModel} from './PintuActionPortModel';
import {IStepConfig} from '../../../lib';
import {IContainerSpec} from '../../../lib/ContainerRegistry';

export class PintuNodeModel extends NodeModel {
  constructor(private config: IStepConfig, private container: IContainerSpec) {
    super('pintuNode');
    _.forEach(container.inputs, (type, name: string) => {
      this.addPort(new PintuInputPortModel(name, type));
    });

    _.forEach(container.actions, (action, name: string) => {
      this.addPort(new PintuActionPortModel(action));
    });
  }

  getName(): string {
    return this.config.containerName;
  }

  private getPortModelsByType<TPortModel>(
    clazz: new (...args: Array<any>) => TPortModel
  ): Array<TPortModel> {
    const ports = this.getPorts();
    return Object.keys(ports).map((portName) => {
      const port = ports[portName];
      if (port instanceof clazz) {
        return port;
      }
      return null;
    }).filter(Boolean) as Array<TPortModel>;
  }

  getInputPortModels(): Array<PintuInputPortModel> {
    return this.getPortModelsByType(PintuInputPortModel);
  }

  getActionPortModels(): Array<PintuActionPortModel> {
    return this.getPortModelsByType(PintuActionPortModel);
  }
}
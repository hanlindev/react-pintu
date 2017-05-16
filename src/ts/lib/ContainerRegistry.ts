import * as _ from 'lodash';
import {StatelessComponent} from 'react';
import {IInputsDeclaration, IActionsDeclaration} from './interfaces';

import {safe} from './utils';

export interface IContainerSpec {
  name: string;
  inputs: IInputsDeclaration;
  actions: IActionsDeclaration;
  pathTemplate: string;
}

export class ContainerRegistry {
  private containers: {[key: string]: IContainerSpec} = {};
  // Path to container name map to prevent and warn duplicate registrations.
  private registeredPaths: {[key: string]: string} = {};
  private registeredComponents: {[key: string]: React.ComponentClass<any>} = {};

  get registeredContainers(): {[key: string]: IContainerSpec} {
    return this.containers;
  }

  register(container: IContainerSpec): IContainerSpec {
    const {
      name,
      pathTemplate
    } = container;

    let registeredName = this.registeredPaths[pathTemplate];
    if (registeredName) {
      throw new TypeError(
        `Path ${pathTemplate} already registered `
        + `by component ${registeredName}.`,
      );
    }

    let registered = this.getComponent(name);
    if (registered) {
      throw new TypeError(
        `Name ${name} already registered by `
        + `component ${registered.name}`,
      );
    }

    this.registeredPaths[pathTemplate] = name;
    this.containers[name] = container;
    return container;
  }

  getComponent(name: string): React.ComponentClass<any> | undefined {
    return this.registeredComponents[name];
  }

  getContainer(name: string): IContainerSpec {
    return this.containers[name];
  }

  static combineRegistries(...registries: Array<ContainerRegistry>): ContainerRegistry {
    const result = new ContainerRegistry();
    registries.forEach((registry) => {
      _.forEach(registry.registeredContainers, (container) => {
        result.register(container);
      });
    });
    return result;
  }
}
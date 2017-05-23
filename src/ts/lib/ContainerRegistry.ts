import * as _ from 'lodash';
import {StatelessComponent} from 'react';
import {IInputsDeclaration, IActionsDeclaration, IContainerSpec} from './interfaces';

import {safe} from './utils';
import {LogicContainer} from './LogicContainer';
import {UIContainer} from './UIContainer';

type ComponentClass = LogicContainer<any> | UIContainer;

export class ContainerRegistry {
  private containers: {[key: string]: IContainerSpec} = {};
  // Path to container name map to prevent and warn duplicate registrations.
  private registeredPaths: {[key: string]: string} = {};
  private registeredComponents: {[key: string]: ComponentClass} = {};

  get containerSpecs(): {[key: string]: IContainerSpec} {
    return this.containers;
  }

  register(
    container: IContainerSpec, 
    componentClass: ComponentClass | LogicContainer<any>
  ): IContainerSpec {
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

    let registered = this.getContainer(name);
    if (registered) {
      throw new TypeError(
        `Name ${name} already registered by `
        + `component ${registered.constructor.name}`,
      );
    }

    this.registeredPaths[pathTemplate] = name;
    this.registeredComponents[name] = componentClass;
    this.containers[name] = container;
    return container;
  }

  getContainer(name: string): ComponentClass {
    return this.registeredComponents[name];
  }

  getContainerSpec(name: string): IContainerSpec {
    return this.containers[name];
  }

  static combineRegistries(
    ...registries: Array<ContainerRegistry>
  ): ContainerRegistry {
    const result = new ContainerRegistry();
    registries.forEach((registry) => {
      _.forEach(registry.containerSpecs, (container) => {
        result.register(container, registry.getContainer(container.name));
      });
    });
    return result;
  }
}
import {StatelessComponent} from 'react';

import {safe} from './utils';

interface IViewSpec {
  component: StatelessComponent<{}>;
  pathTemplate: string;
}

export class ViewRegistry {
  private containers: {[key: string]: IViewSpec} = {};
  private registeredPaths: {[key: string]: StatelessComponent<{}>} = {};

  get registeredContainers(): {[key: string]: IViewSpec} {
    return this.containers;
  }

  register<TP>(
    name: string, 
    pathTemplate: string, 
    component: StatelessComponent<TP>,
  ): StatelessComponent<TP> {
    let registered = this.registeredPaths[pathTemplate];
    if (registered) {
      throw new TypeError(
        `Path ${pathTemplate} already registered `
        + `by component ${registered.name}.`,
      );
    }

    registered = safe(this.containers[name]).component;
    if (registered) {
      throw new TypeError(
        `Name ${name} already registered by `
        + `component ${registered.name}`,
      );
    }

    this.registeredPaths[pathTemplate] = component;
    this.containers[name] = {
      pathTemplate,
      component,
    };
    return component;
  }
}
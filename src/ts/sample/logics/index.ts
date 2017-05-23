import * as React from 'react';

import {ContainerRegistry} from '../../lib/ContainerRegistry';
import {IContainerSpec} from '../../lib/interfaces';
import {LogicContainer} from '../../lib/LogicContainer';

import {BranchLogic} from './BranchLogic';

const containers: Array<LogicContainer<any>> = [
  new BranchLogic(),
];

const registry = new ContainerRegistry();

containers.forEach(async (container) => {
  let containerSpec = container.getContainerSpec();
  if (containerSpec instanceof Promise) {
    containerSpec = await containerSpec;
  }
  registry.register(containerSpec, container);
});

export {
  registry
}
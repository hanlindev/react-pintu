import * as React from 'react';

import {ContainerRegistry} from '../../lib/ContainerRegistry';
import {UIContainer} from '../../lib/UIContainer';
import {IContainerSpec} from '../../lib/interfaces';
import {SampleView} from './SampleView';

const registry = new ContainerRegistry();

const containers: Array<UIContainer> = [
  new SampleView(),
];

containers.forEach(async (view) => {
  let containerSpec = view.getContainerSpec();
  if (containerSpec instanceof Promise) {
    containerSpec = await containerSpec;
  }
  registry.register(containerSpec, view);
});

export {
  registry
};
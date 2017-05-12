import * as React from 'react';

import {ContainerRegistry, IContainerSpec} from '../../lib/ContainerRegistry';
import {SampleView} from './SampleView';

const registry = new ContainerRegistry();

const containers: Array<IContainerSpec> = [
  SampleView.container,
];

containers.forEach((container) => {
  registry.register(container);
});

export {
  registry
};
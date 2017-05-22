import * as React from 'react';

import {ContainerRegistry, IContainerSpec} from '../../lib/ContainerRegistry';
import {SampleView} from './SampleView';

const registry = new ContainerRegistry();

const containers: Array<[IContainerSpec, React.ComponentClass<any>]> = [
  [SampleView.container, SampleView],
];

containers.forEach((spec) => {
  registry.register(spec[0], spec[1]);
});

export {
  registry
};
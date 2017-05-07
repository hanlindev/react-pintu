import * as React from 'react';

import {ViewRegistry} from '../../lib/ViewRegistry';
import {SampleView} from './SampleView';

const registry = new ViewRegistry();

const views: Array<[string, string, React.StatelessComponent<any>]> = [
  ['Sample', '/sample', SampleView]
];

views.forEach((view) => {
  registry.register(view[0], view[1], view[2]);
});

export {
  registry
};
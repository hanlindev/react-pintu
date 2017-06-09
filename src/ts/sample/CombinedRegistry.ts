import {ContainerRegistry} from '../lib';

import {registry as builtInRegistry} from '../lib/containers';
import {registry as viewRegistry} from './views';
import {registry as logicRegistry} from './logics';

export default ContainerRegistry.combineRegistries(
  builtInRegistry,
  viewRegistry,
  logicRegistry,
);
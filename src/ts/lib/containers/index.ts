/**
 * These are built-in containers, most of which have special uses. They may be
 * treated differently in the builder or runner from normal containers. The
 * builder or runner check their type by using `instanceof` so be careful when
 * you extend from them.
 */

export * from './ActionPayloadMultiplexer';

import {ContainerRegistry} from '../ContainerRegistry';
import {ActionPayloadMultiplexer} from './ActionPayloadMultiplexer';

const registry = new ContainerRegistry();

const containers = [
  new ActionPayloadMultiplexer(),
];

containers.forEach((container) => {
  registry.register(container.getContainerSpec(), container);
});

export {
  registry,
}
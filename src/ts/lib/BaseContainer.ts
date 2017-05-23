import {IContainerSpec} from './interfaces';

export abstract class BaseContainer {
  abstract getContainerSpec(): IContainerSpec | Promise<IContainerSpec>;
}
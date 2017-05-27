import {IContainerSpec, IActionsDeclaration} from './interfaces';

export abstract class BaseContainer {
  getActionSpecs(): IActionsDeclaration {
    const containerSpec = this.getContainerSpec();
    return containerSpec.actions;
  }
  abstract getContainerSpec(): IContainerSpec;
}
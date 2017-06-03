import {IContainerSpec, IActionsDeclaration} from './interfaces';

export abstract class BaseContainer {
  getActionSpecs(): IActionsDeclaration {
    const containerSpec = this.getContainerSpec();
    return containerSpec.actions;
  }
  abstract getContainerSpec(): IContainerSpec;
  getSampleActionPayloads(): {[actionID: string]: any} | null {
    // If you want to show some sample action payloads, return a map of
    // actionID -> payload pairs.
    return null;
  }
}
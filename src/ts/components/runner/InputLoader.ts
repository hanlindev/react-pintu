import {IInputsDeclaration, IContainerSpec, IStepPayloadMap, IStepConfig, IURLLocation, IURLParams, IInputSourceMap} from '../../lib/interfaces';

export class InputLoader {
  private _inputs: any;
  get inputs(): any {
    return this._inputs;
  }

  constructor(
    readonly inputSpec: IInputsDeclaration,
    readonly inputSources: IInputSourceMap,
    readonly location: IURLLocation,
    readonly params: IURLParams,
  ) {
    this.generateInput();
  }

  private generateInput() {
    this._inputs = {}; // TODO
  }

  private isValid() {

  }
}
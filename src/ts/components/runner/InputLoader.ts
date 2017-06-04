import * as _ from 'lodash';
import {IInputsDeclaration, IContainerSpec, IStepPayloadMap, IStepConfig, IURLLocation, IURLParams, IInputSourceMap} from '../../lib/interfaces';
import {getRequiredProps, shape} from '../../lib/types';

export class InputLoader {
  private _inputs: any;
  get inputs(): any {
    return this._inputs;
  }

  constructor(
    readonly inputSpec: IInputsDeclaration,
    readonly inputSources: IInputSourceMap,
    readonly stepPayloads: IStepPayloadMap,
    readonly location: IURLLocation,
    readonly params: IURLParams,
  ) {}

  public prepareCommonNodeInputs() {
    this._inputs = {};
    this.generateCommonInputs();
  }

  public prepareActionPayloadMultiplexerInputs(
    stepConfig: IStepConfig,
  ) {
    this._inputs = {};
    this.generateActionPayloadMultiplexerInputs(stepConfig);
  }

  /**
   * For common nodes
   * a) For each input source:
   * 1. Get the value from the source.
   * 2. If a value is not found, keep the field unset in the _inputs map.
   * 
   * b) For each required input from the input spec:
   * 1. If the value is not set in the _inputs map, read from the query and
   * param.
   * 2. If not found in query or param, keep the field unset in the _inputs map.
   */
  private generateCommonInputs() {
    this.generateInputFromSourceSpecs(); // a
    this.generateDefaultValuesForRequiredInputs(); // b
  }

  private generateInputFromSourceSpecs() {
    const result = {};
    _.forEach(this.inputSources, (source, name: string) => {
      switch (source.type) {
        case 'actionPayload':
          const value = _.get(
            this.stepPayloads, 
            [source.stepID, source.actionID, source.outputName],
          );
          if (value !== undefined) {
            this._inputs[name] = value;
          }
          break;
        case 'constant':
          this._inputs[name] = source.value;
          break;
      }
    });
  }

  private generateDefaultValuesForRequiredInputs() {
    const requiredProps = getRequiredProps(this.inputSpec);
    _.forEach(requiredProps, (typeFactory, name: string) => {
      const type = typeFactory();
      if (name in this._inputs || !type.isSerializable()) {
        return;
      }

      if (name in this.params) {
        this._inputs[name] = type.deserialize(this.params[name]);
      } else if (name in this.location.query) {
        this._inputs[name] = type.deserialize(this.location.query[name]);
      }
    });
  }

  /**
   * For ActionPayloadMultiplexerNode
   * 1. Get the only source action.
   * 2. Get the saved payload of that action.
   * 3. Set the payload as the actionPayload field in the input.
   */
  private generateActionPayloadMultiplexerInputs(
    stepConfig: IStepConfig
  ) {
    const {
      stepID,
      actionID,
    } = stepConfig.sources[0];
    const stepPayloads = _.get(this.stepPayloads, [stepID, actionID]);
    this._inputs.actionPayload = stepPayloads;
  }

  public isValid() {
    const inputShape = shape(this.inputSpec)();
    return inputShape.validate(this.inputs);
  }
}
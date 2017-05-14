import * as _ from 'lodash';
import * as Props from 'prop-types';
import {makeFactory} from './common';
import {ITypeChecker, ReactPropType} from '../interfaces';

type PrimitiveType = 
  'number' 
  | 'boolean' 
  | 'string' 
  | 'function' 
  | 'object' 
  | 'array';
type LodashChecker = (value: any) => boolean;
export class PrimitiveTypeChecker implements ITypeChecker {
  private lodashChecker: LodashChecker;

  constructor(
    private type: PrimitiveType,
    private required: boolean,
  ) {
    this.lodashChecker = (_ as any)[`is${_.upperFirst(type)}`];
    if (!this.lodashChecker) {
      throw new TypeError(`Invalid type - ${type}`);
    }
  }

  isEqual(other: ITypeChecker | undefined): boolean {
    return (
      other instanceof PrimitiveTypeChecker
      && this.toString() === other.toString()
    );
  }

  toPropType(): ReactPropType {
    let result;
    switch (this.type) {
      case 'boolean':
        result = Props.bool;
      case 'function':
        result = Props.func;
      default:
        result = (Props as any)[this.type];
    }

    return (this.required) ? result.isReqeuired : result;
  }

  toString() {
    return JSON.stringify(['PrimitiveTypeChecker', this.type, this.required]);
  }

  validate(value: any) {
    return (
      (!this.required && value === undefined)
      || this.lodashChecker(value)
    );
  }

  static getFactory(type: PrimitiveType) {
    return makeFactory(
      new PrimitiveTypeChecker(type, false),
      new PrimitiveTypeChecker(type, true),
    );
  }
}
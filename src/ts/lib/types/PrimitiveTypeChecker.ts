import * as _ from 'lodash';
import * as Props from 'prop-types';
import {makeFactory} from './common';
import {ITypeChecker, ReactPropType, TypeCheckerFactory} from '../interfaces';

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

  toJSON() {
    return this.toString();
  }

  static fromObject(typeObject: any): TypeCheckerFactory | null {
    if (Array.isArray(typeObject)) {
      const name = typeObject[0];
      const type = typeObject[1];
      const required = typeObject[2];
      if (name === 'PrimitiveTypeChecker' && type && required !== undefined) {
        const requireable = PrimitiveTypeChecker.getFactory(type);
        return (required) 
          ? requireable.isRequired
          : requireable;
      }
    }
    return null;
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
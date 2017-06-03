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

  get type(): PrimitiveType {
    return (() => {
      return this._type;
    })();
  }

  get required(): boolean {
    return (() => {
      return this._required;
    })();
  }

  constructor(
    private _type: PrimitiveType,
    private _required: boolean,
  ) {
    this.lodashChecker = (_ as any)[`is${_.upperFirst(_type)}`];
    if (!this.lodashChecker) {
      throw new TypeError(`Invalid type - ${_type}`);
    }
  }

  getName(): string {
    return `${_.upperFirst(this.type)} ${this.getExample()}`;
  }

  getExample(): string {
    const defaultSource = (this.required)
      ? ' (Default from URL)'
      : '';
    switch (this.type) {
      case 'number':
        return 'e.g. 1, 2, 3' + defaultSource;
      case 'boolean':
        return 'e.g. true' + defaultSource;
      case 'string':
        return "e.g. 'abc'" + defaultSource;
      case 'object':
        return "e.g. {a: 1, b: 'c'}";
      case 'array':
        return "e.g. ['a', 1, true]";
      default:
        return '';
    }
  }

  isSerializable(): boolean {
    return ['number', 'boolean', 'string'].indexOf(this.type) >= 0;
  }

  satisfy(other: ITypeChecker | undefined): boolean {
    if (!(other instanceof PrimitiveTypeChecker)) {
      return false;
    }

    const otherString = other.toString();
    const exactEqual = this.toString() === otherString;
    if (exactEqual) {
      return true;
    }

    if (this.required) {
      const notRequiredVersion = 
        PrimitiveTypeChecker.getFactory(this.type)().toString();
      return notRequiredVersion === otherString;
    }

    return false;
  }

  isRequired(): boolean {
    return this.required;
  }

  toPropType(): ReactPropType {
    let result;
    switch (this._type) {
      case 'boolean':
        result = Props.bool;
      case 'function':
        result = Props.func;
      default:
        result = (Props as any)[this._type];
    }

    return (this._required) ? result.isReqeuired : result;
  }

  toString() {
    return JSON.stringify(['PrimitiveTypeChecker', this._type, this._required]);
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
      (!this._required && value === undefined)
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
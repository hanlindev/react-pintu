import * as Props from 'prop-types';
import {makeFactory} from './common';
import {ITypeChecker, ReactPropType} from '../interfaces';

interface ClassConstructor<T> {
  new (...args: Array<any>): T;
}

export class ClassInstanceTypeChecker implements ITypeChecker {
  constructor(
    private clazz: ClassConstructor<any>,
    private required: boolean,
  ) {}

  isEqual(other: ITypeChecker): boolean {
    return (
      other instanceof ClassInstanceTypeChecker
      && other.toString() === this.toString()
    );
  }

  toPropType(): ReactPropType {
    let result = Props.instanceOf(this.clazz);
    return (this.required) ? result.isRequired : result;
  }

  toString() {
    return JSON.stringify(
      ['ClassInstanceTypeChecker', this.clazz.name, this.required],
    );
  }

  validate(value: any) {
    return (
      (!this.required && value === undefined)
      || value instanceof this.clazz
    );
  }

  static getFactory() {
    return (clazz: ClassConstructor<any>) => {
      return makeFactory(
        new ClassInstanceTypeChecker(clazz, false),
        new ClassInstanceTypeChecker(clazz, true),
      );
    };
  }
}
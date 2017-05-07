// JS and TS utils. Not natural language utils. For those things, refer to
// intl.ts
import * as _ from 'lodash';

export function linkToFile(fileName: string): string {
  return fileName;// TODO
}

interface ISafeCall<T> {
  (): T;
  default(value: T | null): this;
  withThis(thisArg: any): this;
}
export function call<T>(
  fn?: (...args: any[]) => T,
  ...args: any[]
): ISafeCall<T> {
  let result = <ISafeCall<T>> (function() {
    return _.isFunction(fn) ? fn.bind(this)(...args) : undefined;
  });

  result.default = function(value: T) {
    return call(function() {
      let fnResult = result();
      if (_.isUndefined(fnResult) && !_.isUndefined(value)) {
        fnResult = value;
      }
      return fnResult;
    });
  };

  result.withThis = function(thisArg: any) {
    return call(function() {
      return result.bind(thisArg)();
    });
  }
  return result;
}

/**
 * Use of this function means you don't care if the fields are filled with
 * meaningful values. All fields must be assumed to be possibly undefined,
 * although the tsc compiler doesn't complain.
 * @param obj 
 */
export function safe<T>(obj: Object | T | null | undefined): T {
  return ((obj || {}) as T);
}

export function genWait(timeout: number): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), timeout);
  });
}

export function notNullOrUndefined<T>(
  object: T | null | undefined,
): object is T {
  return !!object;
}
import * as Props from 'prop-types';
import {ITypeChecker, Requireable} from '../interfaces';

export function makeFactory(
  optional: ITypeChecker,
  required: ITypeChecker,
): Requireable {
  const result: any = () => optional;
  result.isRequired = () => required;
  return result as Requireable;
}

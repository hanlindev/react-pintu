import * as Props from 'prop-types';

export type ReactPropType = Props.Validator<any>;

export type TypeCheckerFactory = () => ITypeChecker;

export interface Requireable extends TypeCheckerFactory {
  isRequired: TypeCheckerFactory;
}

export interface ITypeChecker {
  satisfy(other: ITypeChecker): boolean;
  isRequired(): boolean;
  toPropType?(): ReactPropType;
  toString(): string;
  isSerializable(): boolean;
  toJSON(): string;
  validate(value: any): boolean;
  getName(): string;
  serialize(value: any): string;
  deserialize(strValue: string): any;
}

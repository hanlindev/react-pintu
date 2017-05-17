import * as React from 'react';
import * as Props from 'prop-types';
import * as _ from 'lodash';

export interface ITheme {
  color: {
    light?: string;
    normal?: string;
    dark?: string;
    caution?: string;
    danger?: string;
  };
  spacing: {
    tiny?: number;
    small?: number;
    medium?: number;
    large?: number;
    huge?: number;
  },
  fontSize: {
    small?: number;
    medium?: number;
    large?: number;
  },
}

export type IThemeCustomization = Pick<ITheme, keyof(ITheme)>;

export interface IThemeContext {
  theme: ITheme;
}

export const ThemeContextProps = {
  theme: Props.shape({
    color: Props.shape({
      light: Props.string,
      normal: Props.string,
      dark: Props.string,
      caution: Props.string,
      danger: Props.string,
    }).isRequired,
    spacing: Props.shape({
      tiny: Props.number,
      small: Props.number,
      medium: Props.number,
      large: Props.number,
      huge: Props.number,
    }).isRequired,
    fontSize: Props.shape({
      small: Props.number,
      medium: Props.number,
      large: Props.number,
    }).isRequired,
  }),
}

export function getDefaultTheme(): ITheme {
  return {
    color: {
      light: 'rgba(85, 221, 224, 1)',
      normal: 'rgba(51, 101, 138, 1)',
      dark: 'rgba(47, 72, 88, 1)',
      caution: 'rgba(237, 174, 73, 1)',
      danger: 'rgba(209, 73, 91, 1)',
    },
    spacing: {
      tiny: 4,
      small: 8,
      medium: 12,
      large: 16,
      huge: 26,
    },
    fontSize: {
      small: 10,
      medium: 13,
      large: 20,
    },
  };
}

export class ThemeableComponent<TP, TS> extends React.Component<TP, TS> {
  static contextTypes = ThemeContextProps;

  context: IThemeContext;

  constructor(props: TP, context?: IThemeContext) {
    super(props, context);
  }
}

export function makeThemeable<TP>(component: React.StatelessComponent<TP>) {
  component.contextTypes = ThemeContextProps;
  return component;
}
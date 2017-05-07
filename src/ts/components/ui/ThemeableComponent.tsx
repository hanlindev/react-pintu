import * as React from 'react';
import * as Props from 'prop-types';
import * as _ from 'lodash';

export interface ITheme {
  color: {
    accent?: string;
    danger?: string;
    primary?: string;
  };
}

export type IThemeCustomization = Pick<ITheme, keyof(ITheme)>;

export interface IThemeContext {
  theme: ITheme;
}

export const ThemeContextProps = {
  theme: Props.shape({
    color: Props.shape({
      accent: Props.string,
      danger: Props.string,
      primary: Props.string,
    }).isRequired,
  }),
}

export class ThemeableComponent<TP, TS> extends React.Component<TP, TS> {
  static contextTypes = ThemeContextProps;

  context: IThemeContext;

  constructor(props: TP, context?: IThemeContext) {
    super(props, context);
  }
}
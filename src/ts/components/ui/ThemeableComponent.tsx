import * as React from 'react';
import * as _ from 'lodash';

export interface ITheme {
  color: {
    primary?: string;
    accent?: string;
    danger?: string;
  };
}

export type IThemeCustomization = Pick<ITheme, keyof(ITheme)>;

export interface IThemeContext {
  theme: ITheme;
}


export class ThemeableComponent<TP, TS> extends React.Component<TP, TS> {
  context: IThemeContext;

  constructor(props: TP, context?: IThemeContext) {
    super(props, context);
    console.log(context);//fd
  }
}
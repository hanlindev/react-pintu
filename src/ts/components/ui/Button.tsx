import * as React from 'react';
import {ThemeableComponent} from './ThemeableComponent';
import {safe} from '../../lib/utils';

export interface IButtonProps {
  label?: React.ReactNode;
  onClick?: (e: React.MouseEvent<any>) => any;
  use?: 'default' | 'confirm' | 'danger';
}

export class Button extends ThemeableComponent<IButtonProps, void> {
  static defaultProps = {
    use: 'default',
  };

  constructor(props: IButtonProps, context: any) {
    super(props, context);
  }

  private getStyles() {
    const {use} = this.props;
    const {theme} = this.context;
    console.log(this.context);//fd
    // TODO use radium to handle pseudo-selectors (eg. :hover)
    switch (use) {
      case 'default':
        return {
          color: theme.color.accent,
        };
      case 'confirm':
        return {
          color: theme.color.primary,
        }
      case 'danger':
        return {
          color: theme.color.danger,
        }
    }
  }

  render() {
    const {label, children, onClick} = this.props;

    return (
      <button
        onClick={onClick} 
        style={this.getStyles()}
      >
        {label || children}
      </button>
    );
  }
}
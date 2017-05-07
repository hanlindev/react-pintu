import * as React from 'react';
import * as Radium from 'radium';
import * as color from 'tinycolor2';
import {ThemeableComponent} from './ThemeableComponent';
import {safe} from '../../lib/utils';

type UseType = 'default' | 'confirm' | 'danger';

export interface IButtonProps {
  label?: React.ReactNode;
  onClick?: (e: React.MouseEvent<any>) => any;
  use?: 'default' | 'confirm' | 'danger';
}

class _Button extends ThemeableComponent<IButtonProps, void> {
  static defaultProps = {
    use: 'default',
  };

  constructor(props: IButtonProps, context: any) {
    super(props, context);
  }

  private getStyles() {
    const {use} = this.props;
    const {theme} = this.context;

    const colorTheme = {
      confirm: {
        backgroundColor: theme.color.primary,
      },
      danger: {
        backgroundColor: theme.color.danger,
      },
      default: {
        color: 'white',
        backgroundColor: theme.color.accent,
      },
    }[use as UseType];

    const {
      backgroundColor
    } = colorTheme;
    const result = {
      ...colorTheme,
      border: 'none',
      outline: 'none',
      padding: '4px 8px 4px 8px',
      ':hover': {
        backgroundColor: color(backgroundColor as string).darken(5),
      },
      ':active': {
        backgroundColor: color(backgroundColor as string).darken(10),
      }
    }
    return result;
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

export const Button = Radium(_Button);
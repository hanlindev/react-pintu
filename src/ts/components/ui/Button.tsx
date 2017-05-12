import * as React from 'react';
import * as Radium from 'radium';
import * as tinycolor from 'tinycolor2';
import {ThemeableComponent} from './ThemeableComponent';
import {safe} from '../../lib/utils';

type UseType = 'default' | 'confirm' | 'danger';
type SizeType = 'small' | 'medium' | 'large';

export interface IButtonProps {
  className?: string;
  label?: React.ReactNode;
  onClick?: (e: React.MouseEvent<any>) => any;
  size?: SizeType;
  style?: React.CSSProperties;
  use?: UseType;
}

class _Button extends ThemeableComponent<IButtonProps, void> {
  static defaultProps = {
    size: 'medium',
    use: 'default',
  };

  constructor(props: IButtonProps, context: any) {
    super(props, context);
  }

  private getStyles() {
    const {size, use} = this.props;
    const {
      theme: {
        color, 
        spacing, 
        fontSize,
      },
    } = this.context;

    const colorTheme = {
      confirm: {
        color: 'white',
        backgroundColor: color.light,
      },
      danger: {
        color: 'white',
        backgroundColor: color.danger,
      },
      default: {
        color: 'white',
        backgroundColor: color.normal,
      },
    }[use as UseType];

    const sizeTheme = {
      small: {
        fontSize: fontSize.small,
        padding: `${spacing.tiny}px ${spacing.medium}px`,
      },
      medium: {
        fontSize: fontSize.medium,
        padding: `${spacing.tiny}px ${spacing.medium}px`,
      },
      large: {
        fontSize: fontSize.large,
        padding: `${spacing.small}px ${spacing.large}px`,
      },
    }[size as SizeType];

    const {
      backgroundColor
    } = colorTheme;
    const result = {
      ...colorTheme,
      cursor: 'pointer',
      border: 'none',
      borderRadius: 2,
      outline: 'none',
      ...sizeTheme,
      ':hover': {
        backgroundColor: tinycolor(backgroundColor as string).darken(10),
      },
      ':active': {
        backgroundColor: tinycolor(backgroundColor as string).darken(20),
      }
    }
    return result;
  }

  render() {
    const {
      children, 
      className,
      label,
      onClick,
      style,
    } = this.props;

    return (
      <button
        className={className}
        onClick={onClick} 
        style={{
          ...this.getStyles(),
          ...style,
        }}
      >
        {label || children}
      </button>
    );
  }
}

export const Button = Radium(_Button);
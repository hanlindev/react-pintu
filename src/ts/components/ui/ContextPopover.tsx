import * as React from 'react';
import {CSSProperties} from 'react';
import {Popover} from 'material-ui';
import {ThemeableComponent} from './ThemeableComponent';

interface IPosition {
  top: number;
  left: number;
}

interface IContextPopoverProps {
  position?: IPosition,
  show: boolean,
}

interface IContextPopoverState {
  anchor: Element | undefined;
}

export class ContextPopover 
  extends ThemeableComponent<IContextPopoverProps, IContextPopoverState> {

  state: IContextPopoverState = {
    anchor: undefined,
  };

  private getRootStyle(): CSSProperties {
    const {
      position,
    } = this.props;

    return {
      position: 'fixed',
      ...position,
      zIndex: 2000,
    }
  }

  private shouldShow(): boolean {
    return !!this.props.position && this.props.show;
  }
  
  render() {
    const {
      children,
      position,
      show,
    } = this.props;

    if (!this.shouldShow()) {
      return null;
    }

    return (
      <div
        style={this.getRootStyle()}
      >
        {children}
      </div>
    );
  }
}
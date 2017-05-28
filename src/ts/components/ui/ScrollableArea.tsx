import * as React from 'react';
import ScrollArea from 'react-scrollbar-js';
import {ThemeableComponent} from './ThemeableComponent';

interface IScrollableAreaProps {
  className?: string;
  height: number | string;
  style?: React.CSSProperties,
}

export class ScrollableArea 
  extends ThemeableComponent<IScrollableAreaProps, void> {

  private getRootStyle(): React.CSSProperties {
    const {
      height,
      style,
    } = this.props;

    return {
      ...style,
      height,
    };
  }

  render() {
    return (
      <ScrollArea 
        className={this.props.className}
        style={this.getRootStyle()}
      >
        {this.props.children}
      </ScrollArea>
    )
  }
}
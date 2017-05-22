import * as React from 'react';
import ScrollArea from 'react-scrollbar-js';
import {ThemeableComponent} from './ThemeableComponent';

interface IScrollableAreaProps {
  height: number;
}

export class ScrollableArea 
  extends ThemeableComponent<IScrollableAreaProps, void> {

  private getRootStyle(): React.CSSProperties {
    const {
      height,
    } = this.props;

    return {
      height,
    };
  }

  render() {
    return (
      <ScrollArea 
        style={this.getRootStyle()}
      >
        {this.props.children}
      </ScrollArea>
    )
  }
}
declare module 'react-scrollbar-js' {
  import * as React from 'react';

  interface Props {
    className?: string;
    style?: React.CSSProperties;
    speed?: number;
  }

  export default class ReactScrollbar extends React.Component<Props, any> {
    scrollToY(y: number);
    scrollToX(x: number);    
  }
}
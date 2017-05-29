import * as React from 'react';

interface IProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export class MiddleEmptyRow extends React.Component<IProps, void> {
  render() {
    const {
      style, 
      children,
    } = this.props;
    const flexibleStyle: React.CSSProperties = {
      flex: '0 0 auto',
      flexWrap: 'nowrap',
    }
    
    if (React.Children.count(children) === 2) {
      const items = React.Children.toArray(children);
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            ...style,
          }}
        >
          <div style={flexibleStyle}>
            {items[0]}
          </div>

          <div style={{flex: 1}} />

          <div style={flexibleStyle}>
            {items[1]}
          </div>
        </div>
      );
    }

    return null;
  }
}
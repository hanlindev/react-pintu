import * as React from 'react';
import {FontIcon} from 'material-ui';

export function Icon(props: any) {
  return (
    <FontIcon 
      className="material-icons"
      style={{
        color: 'white',
        ...props.style,
      }}
    >
      {props.children}
    </FontIcon>
  );
}
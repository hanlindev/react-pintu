import {isFunction} from 'lodash';
import {CSSProperties} from 'react';

interface ICSSPropertiesGetter {
  (...args: Array<any>): CSSProperties;
}
const PresetStyles: {[key: string]: CSSProperties | ICSSPropertiesGetter} = {
  ellipsis: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  paddingVert: (val): CSSProperties => {
    return {
      paddingLeft: val,
      paddingRight: val,
    };
  }
}

export function style(name: string, ...args: Array<any>): CSSProperties {
  if (!(name in PresetStyles)) {
    throw new TypeError(`${name} is not a preset style`);
  }
  const result = PresetStyles[name];
  if (isFunction(result)) {
    return result(args);
  }
  return result;
}
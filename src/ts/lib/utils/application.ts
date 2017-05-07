import * as _ from 'lodash';
import {fillString, buildQueryString, getStringParams} from './strings';
import {safe} from './language';

export interface IPathTo {
  (args?: any|any[], getParams?: Object): string;
  ComponentName: string;
}

export function getPathTo(
  pathTemplate: string,
  componentName: string
): IPathTo {
  let keys = getStringParams(pathTemplate);
  const pathHelper = safe<IPathTo>(
    (args?: any|any[], getParams?: Object) => {
      let result = pathTemplate;
      if (keys.length > 0 && !_.isUndefined(args)) {
        const argsArray = [].concat(args).filter((value) => value !== undefined);
        const setKeys = keys.slice(0, argsArray.length);
        result = fillString(result, _.zipObject(setKeys, argsArray));
      }

      if (!getParams) {
        return result;
      }

      let queryString = buildQueryString(getParams);
      if (!!queryString) {
        result += '?' + queryString;
      }

      return result;
    }
  );
  pathHelper.ComponentName = componentName;
  return pathHelper;
}

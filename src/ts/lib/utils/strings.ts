import * as _ from 'lodash';
import {stringify} from 'query-string';

export function sprintf(format: string, ...args: any[]) {
  var i = args.length;
  while (i--) {
    format = format.replace(new RegExp('\\{' + i + '\\}', 'gm'), args[i]);
  }
  return format;
}

/**
 * Fill the string template with arguments.
 * @param  {string} template The string template. Parameters are marked by
 *                           a colon. So '/resource/:id/action' has one
 *                           parameter that is 'id'.
 * @param  {dict}   args     Values for the parameters.
 * @return {string}          The string result by filling in the arguments to
 *                           the paramter slots. Parameters without arguments
 *                           will be left in their original state. E.g.
 *                           '/resource/:id/action/:extra' with argument of
 *                           {id: 1} will return '/resource/1/action/:extra'.
 */
export function fillString(
    template: string,
    args: {[key: string]: any}
): string {
  template = template.replace(
    /\(\/:(\w+)+\)/g,
    (whole, name) => {
      if (name in args) {
        return `/${args[name]}`;
      } else {
        return '';
      }
    }
  );

  return template.replace(
    /:(\w+)/g,
    (whole, name) => {
      if (name in args) {
        return args[name];
      } else {
        return whole;
      }
    }
  );
}

/**
 * Get the parameter names in the template string.
 * @param  {string}   template The template string format is the same as
 *                             fillString function.
 * @return {string[]}          The parameter names with the colon stripped off.
 */
export function getStringParams(template: string): string[] {
  let result: string[] = [];
  let r = /:(\w+)/g;
  let component;
  while ((component = r.exec(template)) !== null) {
    result.push(component[1]);
  }
  return result;
}

export function camelToWords(camelName: string): string {
  if (!camelName) {
    return '';
  }

  const splitted = camelName.replace(
    /[A-Z]/g,
    (letter) => {
      return ' ' + letter;
    }
  );
  return splitted.charAt(0).toUpperCase() + splitted.slice(1);
}

export function buildQueryString(params: {[key: string]: any}): string {
  return stringify(params);
}

export function prettyJson(obj: any) {
  return JSON.stringify(obj, null, 2);
}

export function ensureString(value: any) {
  if (_.isArray(value) || _.isObject(value)) {
    return prettyJson(value);
  } else {
    return value.toString();
  }
}

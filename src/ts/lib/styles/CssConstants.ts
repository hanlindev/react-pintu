const CssConstants: {[key: string]: number | string} = {
  black: '#000000',
  border: '1px solid rgba(0, 0, 0, 0.4)',
  'grey-50': '#FAFAFA',
};

export function cssConstant(name: string) {
  if (!(name in CssConstants)) {
    throw TypeError(`${name} is not a known CSS constant`);
  }
  return CssConstants[name];
}
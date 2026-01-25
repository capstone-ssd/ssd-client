module.exports = {
  typescript: true,
  icon: true,
  svgProps: {
    role: 'img',
  },
  replaceAttrValues: {
    '#000': 'currentColor',
    '#000000': 'currentColor',
  },
  prettier: false,
  prettierConfig: {
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
  },
  template: require('./svgr-template.cjs'),
};

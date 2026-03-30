function template(variables, { tpl }) {
  return tpl`
import type { SVGProps } from 'react';

const ${variables.componentName} = (${variables.props}) => (
  ${variables.jsx}
);

export default ${variables.componentName};
`;
}

module.exports = template;

function template(variables, { tpl }) {
  return tpl`
  ${variables.imports};
  
  ${variables.interfaces};
  
  const ${variables.componentName} = (${variables.props}) => (
    ${variables.jsx}
  );
  
  export default ${variables.componentName};
  `;
}

module.exports = template;

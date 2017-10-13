const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const t = require('babel-types');
const fs = require('fs');

import readFiles from './utils/read-files';

const isReactImport = specifier => specifier.local.name !== 'React' || specifier.local.name !== 'react';
const filterReactSpecifiers = node => node.specifiers && node.specifiers.filter(isReactImport);
const getDefaultExportName = node => node.declaration.loc.identifierName;

const parserOptions = {
  sourceType: 'module',
  plugins: ['jsx'],
}

const parse = files => {
  const components = {
    nodes: [],
  };

  Object.keys(files)
    .forEach(file => {
      const ast = babylon.parse(files[file], parserOptions);

      traverse(ast, {
        enter(path) {
          const node = path.node;
          const container = path.container;

          if (t.isExportDefaultDeclaration(node)) {
            if (container.some(filterReactSpecifiers)) {
              const componentName = getDefaultExportName(node);

              components.nodes.push({
                id: componentName,
                group: '1',
              });
            }
          }
        }
      })
    });

    return components;
};

const writeToJSON = components => {
  try {
    fs.writeFileSync('./out.json', JSON.stringify(components));
  } catch (error) {
    console.error('Error writing components to out.json\n', error);
  }
}

readFiles('./')
  .then(parse)
  .then(writeToJSON)
  .catch(error => console.warn(error));

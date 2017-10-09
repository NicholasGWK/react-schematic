const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const t = require('babel-types');

import readFiles from './utils/read-files';

const isReactImport = specifier => specifier.local.name !== 'React' || specifier.local.name !== 'react';
const filterReactSpecifiers = node => node.specifiers && node.specifiers.filter(isReactImport);

const parserOptions = {
  sourceType: 'module',
  plugins: ['jsx'],
}

const parse = files => {
  const components = [];

  Object.keys(files)
    .forEach(file => {
      const ast = babylon.parse(files[file], parserOptions);

      traverse(ast, {
        enter(path) {
          if (t.isExportDefaultDeclaration(path.node)) {
            if (path.container.some(filterReactSpecifiers)) {
              components.push(path);
            }
          }
        }
      })
    });

    return components;
};

readFiles('./')
  .then(parse)
  .then(console.log)
  .catch(error => console.warn(error));

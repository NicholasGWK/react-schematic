const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const t = require("babel-types");
const fs = require('fs');

const component = fs.readFileSync('./component.jsx', 'utf-8');

const result = babylon.parse(component, {
  sourceType: 'module',
  plugins: [
    'jsx'
  ]
});

traverse(result, {
  enter(path) {
    if (t.isExportDefaultDeclaration(path.node)) {
      console.log(path.node);
    }
  }
});
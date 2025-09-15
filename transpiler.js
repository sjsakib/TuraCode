const nearley = require('nearley');
const grammar = require('./lang.js');

function parse(input) {
  try {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(input);
    parser.finish();
    if (parser.results.length > 1) {
      console.warn('Warning: Ambiguous grammar detected. Multiple parse results.');
    } else if (parser.results.length === 0) {
      throw new Error('Error: No parse results.');
    }
    return parser.results[0];
  } catch (e) {
    throw e;
  }
}

function transpile(ast) {
  if (Array.isArray(ast)) {
    return ast.map(transpileStmt).join('\n');
  } else {
    return transpileStmt(ast);
  }
}

function transpileStmt(node) {
  switch (node.type) {
    case 'VarDecl':
      return `let ${node.id} = ${transpileExpr(node.expr)};`;
    case 'AssignStmt':
      return `${node.id} = ${transpileExpr(node.expr)};`;
    case 'IfStmt':
      let res = `if ${transpileExpr(node.cond)} { ${node.then.map(transpileStmt).join('\n')} }`;
      if (node.else) {
        res += ` else { ${node.else.map(transpileStmt).join('\n')} }`;
      }
      return res;
    case 'ForStmt':
      const init = transpileStmt(node.init);
      const cond = transpileExpr(node.cond);
      const step = transpileStmt(node.step).replace(/;$/, '');
      return `for (${init} ${cond}; ${step}) { ${node.body.map(transpileStmt).join('\n')} }`;
    case 'CallExpr':
      let callee = node.callee;
      if (callee !== 'dakao') {
        throw new Error(`Unknown function: ${callee}`);
      } else {
        callee = 'console.log';
      }
      return `${callee}(${node.args.map(transpileExpr).join(', ')});`;
    default:
      throw new Error(`Unknown AST node type: ${node.type}`, {node});
  }
}

function transpileExpr(node) {
  switch (node.type) {
    case 'BinaryExpr':
      return `(${transpileExpr(node.left)} ${node.op} ${transpileExpr(node.right)})`;
    case 'NumberLiteral':
      return node.value;
    case 'StringLiteral':
      return JSON.stringify(node.value);
    case 'Identifier':
      return node.name;
    default:
      throw new Error(`Unknown expression type: ${node.type}`);
  }
}

module.exports = { transpile, parse };
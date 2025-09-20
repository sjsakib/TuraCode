import { transpileAst, parse } from './transpiler.js';

export function transpileSrc(code) {
  const ast = parse(code);
  return transpileAst(ast);
}

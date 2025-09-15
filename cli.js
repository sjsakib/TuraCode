const { transpile, parse } = require('./transpiler');
  const fs = require('fs');


function main() {
  const input = process.argv[2] ? fs.readFileSync(process.argv[2], 'utf-8') : fs.readFileSync(0, 'utf-8');

  const ast = parse(input);
  const js = transpile(ast);

  eval(js);
}

main();
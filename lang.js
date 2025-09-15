// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

const lexer = moo.compile({
  WS:        { match: /\s+/, lineBreaks: true },
  number:    /[0-9]+/,
  string:    /"(?:\\["\\]|[^\n"\\])*"/,
  // Comment tokens
  comment:   { match: /\/\/.*?$/, lineBreaks: true },
  mcomment:  { match: /\/\*[^]*?\*\//, lineBreaks: true },
  keyword:   ["ata", "hola", "dakao", "godi", "na", "holae", "calay", "gao"],
  lbrace:    "{",
  rbrace:    "}",
  lparen:    "(",
  rparen:    ")",
  semicolon: ";",
  assign:    "=",
  plusplus:  "++",
  minusminus:"--",
  op:        /[+\-*/<>]=?|==/,
  identifier:/[a-zA-Z_][a-zA-Z0-9_]*/,
});
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "Program$ebnf$1", "symbols": []},
    {"name": "Program$ebnf$1$subexpression$1", "symbols": ["_", "Statement"]},
    {"name": "Program$ebnf$1", "symbols": ["Program$ebnf$1", "Program$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Program", "symbols": ["_", "Statement", "Program$ebnf$1", "_"], "postprocess": d => [d[1], ...(d[2].map(x => x[1]))]},
    {"name": "Statement", "symbols": ["VarDecl"], "postprocess": d => d[0]},
    {"name": "Statement", "symbols": ["AssignStmt"], "postprocess": d => d[0]},
    {"name": "Statement", "symbols": ["CallExpr"], "postprocess": d => d[0]},
    {"name": "Statement", "symbols": ["IfStmt"], "postprocess": id},
    {"name": "Statement", "symbols": ["ForStmt"], "postprocess": id},
    {"name": "VarDecl", "symbols": [{"literal":"ata"}, "_", {"literal":"hola"}, "_", (lexer.has("identifier") ? {type: "identifier"} : identifier), "_", (lexer.has("assign") ? {type: "assign"} : assign), "_", "Expr"], "postprocess": d => ({ type: "VarDecl", id: d[4].value, expr: d[8] })},
    {"name": "AssignStmt", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", (lexer.has("assign") ? {type: "assign"} : assign), "_", "Expr"], "postprocess": d => ({ type: "AssignStmt", id: d[0].value, expr: d[4] })},
    {"name": "AssignStmt", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", (lexer.has("plusplus") ? {type: "plusplus"} : plusplus)], "postprocess": d => ({ type: "AssignStmt", id: d[0].value, expr: { type: "BinaryExpr", op: "+", left: { type: "Identifier", name: d[0].value }, right: { type: "NumberLiteral", value: 1 } } })},
    {"name": "AssignStmt", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", (lexer.has("minusminus") ? {type: "minusminus"} : minusminus)], "postprocess": d => ({ type: "AssignStmt", id: d[0].value, expr: { type: "BinaryExpr", op: "-", left: { type: "Identifier", name: d[0].value }, right: { type: "NumberLiteral", value: 1 } } })},
    {"name": "AssignStmt", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", (lexer.has("op") ? {type: "op"} : op), "_", "Expr"], "postprocess": d => ({ type: "AssignStmt", id: d[0].value, expr: { type: "BinaryExpr", op: d[2].value, left: { type: "Identifier", name: d[0].value }, right: d[4] } })},
    {"name": "Expr", "symbols": ["Term", "_", (lexer.has("op") ? {type: "op"} : op), "_", "Term"], "postprocess": d => ({ type: "BinaryExpr", op: d[2].value, left: d[0], right: d[4] })},
    {"name": "Expr", "symbols": ["Term"], "postprocess": id},
    {"name": "Term", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": d => ({ type: "NumberLiteral", value: Number(d[0].value) })},
    {"name": "Term", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": d => ({ type: "StringLiteral", value: d[0].value.slice(1,-1) })},
    {"name": "Term", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": d => ({ type: "Identifier", name: d[0].value })},
    {"name": "CallExpr$ebnf$1$subexpression$1", "symbols": ["ArgList"]},
    {"name": "CallExpr$ebnf$1", "symbols": ["CallExpr$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "CallExpr$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "CallExpr", "symbols": [{"literal":"dakao"}, (lexer.has("lparen") ? {type: "lparen"} : lparen), "CallExpr$ebnf$1", (lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": d => ({ type: "CallExpr", callee: "dakao", args: d[2] ? d[2][0] : [] })},
    {"name": "ArgList$ebnf$1", "symbols": []},
    {"name": "ArgList$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "_", "Expr"]},
    {"name": "ArgList$ebnf$1", "symbols": ["ArgList$ebnf$1", "ArgList$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ArgList", "symbols": ["Expr", "ArgList$ebnf$1"], "postprocess": d => [d[0], ...(d[1].map(x=>x[2]))]},
    {"name": "IfStmt$ebnf$1", "symbols": ["ElsePart"], "postprocess": id},
    {"name": "IfStmt$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "IfStmt", "symbols": [{"literal":"godi"}, "_", "Expr", "_", "Block", "_", "IfStmt$ebnf$1"], "postprocess": d => ({ type: "IfStmt", cond: d[2], then: d[4], else: d[6]||null })},
    {"name": "ElsePart", "symbols": [{"literal":"na"}, "_", {"literal":"holae"}, "_", "Block"], "postprocess": d => d[4]},
    {"name": "ForStmt", "symbols": [{"literal":"calay"}, "_", {"literal":"gao"}, "_", "ForHeader", "_", "Block"], "postprocess": d => ({ type: "ForStmt", init: d[4].init, cond: d[4].cond, step: d[4].step, body: d[6] })},
    {"name": "ForHeader", "symbols": ["Statement", (lexer.has("semicolon") ? {type: "semicolon"} : semicolon), "_", "Expr", (lexer.has("semicolon") ? {type: "semicolon"} : semicolon), "_", "AssignStmt"], "postprocess": d => ({ init: d[0], cond: d[3], step: d[6] })},
    {"name": "Block$ebnf$1", "symbols": []},
    {"name": "Block$ebnf$1", "symbols": ["Block$ebnf$1", "Statement"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Block", "symbols": [(lexer.has("lbrace") ? {type: "lbrace"} : lbrace), "_", "Block$ebnf$1", "_", (lexer.has("rbrace") ? {type: "rbrace"} : rbrace)], "postprocess": d => d[2]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null}
]
  , ParserStart: "Program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

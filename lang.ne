@{%
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
%}

@lexer lexer

Program -> _ Statement (_ Statement):* _
     {% d => [d[1], ...(d[2].map(x => x[1]))] %}

Statement
  -> VarDecl              {% d => d[0] %}
  | AssignStmt            {% d => d[0] %}
  | CallExpr              {% d => d[0] %}
  | IfStmt                {% id %}
  | ForStmt               {% id %}

# --- Variable declaration
VarDecl
  -> "ata" _ "hola" _ %identifier _ %assign _ Expr
     {% d => ({ type: "VarDecl", id: d[4].value, expr: d[8] }) %}

# --- Assignment
AssignStmt
    -> %identifier _ %assign _ Expr
       {% d => ({ type: "AssignStmt", id: d[0].value, expr: d[4] }) %}
    | %identifier _ %plusplus
       {% d => ({ type: "AssignStmt", id: d[0].value, expr: { type: "BinaryExpr", op: "+", left: { type: "Identifier", name: d[0].value }, right: { type: "NumberLiteral", value: 1 } } }) %}
    | %identifier _ %minusminus
       {% d => ({ type: "AssignStmt", id: d[0].value, expr: { type: "BinaryExpr", op: "-", left: { type: "Identifier", name: d[0].value }, right: { type: "NumberLiteral", value: 1 } } }) %}
    | %identifier _ %op _ Expr
       {% d => ({ type: "AssignStmt", id: d[0].value, expr: { type: "BinaryExpr", op: d[2].value, left: { type: "Identifier", name: d[0].value }, right: d[4] } }) %}

# --- Expressions
Expr
  -> Term _ %op _ Term               {% d => ({ type: "BinaryExpr", op: d[2].value, left: d[0], right: d[4] }) %}
  | Term                            {% id %}

Term
  -> %number                         {% d => ({ type: "NumberLiteral", value: Number(d[0].value) }) %}
  | %string                          {% d => ({ type: "StringLiteral", value: d[0].value.slice(1,-1) }) %}
  | %identifier                      {% d => ({ type: "Identifier", name: d[0].value }) %}

# --- Function call
CallExpr
  -> "dakao" %lparen (ArgList):? %rparen
     {% d => ({ type: "CallExpr", callee: "dakao", args: d[2] ? d[2][0] : [] }) %}

ArgList
  -> Expr ("," _ Expr):* {% d => [d[0], ...(d[1].map(x=>x[2]))] %}

# --- If/else
IfStmt
  -> "godi" _ Expr _ Block _ ElsePart:?
     {% d => ({ type: "IfStmt", cond: d[2], then: d[4], else: d[6]||null }) %}

ElsePart
  -> "na" _ "holae" _ Block
     {% d => d[4] %}

# --- For loop
ForStmt
  -> "calay" _ "gao" _ ForHeader _ Block
     {% d => ({ type: "ForStmt", init: d[4].init, cond: d[4].cond, step: d[4].step, body: d[6] }) %}

ForHeader
  -> Statement %semicolon _ Expr %semicolon _ AssignStmt
     {% d => ({ init: d[0], cond: d[3], step: d[6] }) %}

# --- Blocks
Block
  -> %lbrace _ Statement:* _ %rbrace
     {% d => d[2] %}

_ -> (%WS | %comment | %mcomment):* {% () => null %}
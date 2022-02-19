export const TYPES = {
  string: 'String',
  number: 'Number',
  expression: 'Expression',
}

export const EXPRESSION_TYPES = {
  mathExpression: 'MathExpression',
}

export const EXPRESSIONS = {
  cin: 'cin',
  cout: 'cout',
  mathOperators: [{
    priority: 1,
    operator: '*',
  },
  {
    priority: 1,
    operator: '/',
  },
  {
    priority: 2,
    operator: '+',
  },
  {
    priority: 2,
    operator: '-',
  }],
}


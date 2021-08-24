import { AST, Primitive } from './api/entities'
import { TYPES } from './api/constants'
import topScope from './api/topScope'

const ast = new AST()
// const parser = new Parser({ program, ast }) Should work like this

function excludeSpaces (program) {
  return program.trim()
}

function parseExpression (program) {
  let match, expr
  program = excludeSpaces(program)

  if (match = /^vol\s*(\w+)\s*=\s*(\d+)\b/.exec(program)) {
    expr = new Primitive({ type: TYPES.number, name: match[1], value: Number(match[2])})
    ast.addVol(expr)
  } else if (match = /^vol\s*(\w+)\s*=\s*"(\w+?)"/.exec(program)) {
    expr = new Primitive({ type: TYPES.string, name: match[1], value: match[2]})
    ast.addVol(expr)
  } else {
    match = parseAction(program)
  }

  let remainProgram = program.slice(match[0].length)
  if (remainProgram.length) {
    parseExpression(remainProgram)
  }

  return ast
}

function parseAction (program) {
  let match, expr
  program = excludeSpaces(program)
  
  if (match = /^c\.(out|in)\((.+)\)/.exec(program)) {
    expr = { 
      type: TYPES.expression,
      args: parseArguments(match[2]),
      kind: 'c' + match[1]
    }
    ast.addAction(expr)
  } else {
    throw SyntaxError(`Unexpected syntax ${program}`)
  }

  return match
}

function parseArguments (program) {
  let args = program.split(',').map(defineArgument)
  return args
}

function defineArgument (val) {
  let arg = {}
  let value = val.trim()

  if (String(value).charAt(0) === '"') {
    arg = new Primitive({ value: String(value).replace(/\"/g, '') })
  } else if (!isNaN(value)) {
    arg = new Primitive({ value: Number(value) })
  } else {
    arg = new Primitive({ name: value }) // Remove actions with ast
  }

  return arg
}

async function interpret (ast) {
  if (!ast.stack.length) return
  console.log('stack', ast.stack)

  for (const action of ast.stack) {
    if (action.type === TYPES.expression) {
      const args = action.args.map(arg => ast.global[arg.name] || arg)
      await topScope[action.kind](ast, args)
    }
  }
}

// let expression = `
//   vol i = "asd"
//   vol b = 1231
// `
let expression = `
  vol i = "asd"
  vol b = 1231
  c.out(i, b)
  c.in(i, b)
  c.out(i, b)
`

parseExpression(expression)
interpret(ast)

/*
  Example of program in future

  vol i = 0
  vol x = 10

  c.out(x) // simple print of varriable
  c.in(i) // you should to write smth in console to define "i"

  loop:i;i<x;i++:{
    doSmth
  }

  shaqo root(a, b){
    vol sum = a + b
    return res
  }
*/

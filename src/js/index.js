import { AST, Primitive } from './api/entities'
import { TYPES } from './api/constants'
import { Interpreter } from './api/interpreter'
import { topScope } from './api/topScope'
import { Parser } from './api/parser'

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

const ast = new AST()
const interpreter = new Interpreter()
const parser = new Parser(ast)

parser.parseExpression(expression)
interpreter.interpret(ast)

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

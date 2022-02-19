import { AST } from './api/entities'
import { Interpreter } from './api/interpreter'
import { Parser } from './api/parser'

// let expression = `
//   vol i = "asd"
//   vol b = 1231
// `
// 2+3+35*52+5*421*63*4421

let expression = `
  2+3+4+5+6*6+5*6*412
`

// vol i = "asd"
// vol b = 1231
// c.out(i, b)
// c.in(i, b)
// c.out(i, b)

const ast = new AST()
const parser = new Parser(ast)
const interpreter = new Interpreter()

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

import { excludeSpaces } from './utils'
import { Primitive } from './entities'
import { TYPES } from './constants'
export class Parser {
  constructor (ast) {
    this.ast = ast
  }
  
  parseExpression (program) {
    let match, expr
    program = excludeSpaces(program)

    if (match = /^vol\s*(\w+)\s*=\s*(\d+)\b/.exec(program)) {
      expr = new Primitive({ type: TYPES.number, name: match[1], value: Number(match[2])})
      this.ast.addVol(expr)
    } else if (match = /^vol\s*(\w+)\s*=\s*"(\w+?)"/.exec(program)) {
      expr = new Primitive({ type: TYPES.string, name: match[1], value: match[2]})
      this.ast.addVol(expr)
    } else {
      match = this.parseAction(program)
    }
  
    let remainProgram = program.slice(match[0].length)
    if (remainProgram.length) {
      this.parseExpression(remainProgram)
    }
  
    return this.ast
  }
  
  
  parseAction (program) {
    let match, expr
    program = excludeSpaces(program)
    
    if (match = /^c\.(out|in)\((.+)\)/.exec(program)) {
      expr = { 
        type: TYPES.expression,
        args: this.parseArguments(match[2]),
        kind: 'c' + match[1]
      }
      this.ast.addAction(expr)
    } else {
      throw SyntaxError(`Unexpected syntax ${program}`)
    }
  
    return match
  }
  
  
  parseArguments (program) {
    let args = program.split(',').map(this.defineArgument)
    return args
  }
  
  
  defineArgument (val) {
    let value = val.trim()
    let arg = new Primitive({ name: value })
  
    if (String(value).charAt(0) === '"') {
      arg = new Primitive({ value: String(value).replace(/\"/g, '') })
    } else if (!isNaN(value)) {
      arg = new Primitive({ value: Number(value) })
    }
  
    return arg
  }
}
import { excludeSpaces } from './utils'
import { Primitive, Action } from './entities'
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
  }
  
  parseAction (program) {
    let match, expr
    program = excludeSpaces(program)
    
    if (match = /^c\.(out|in)\((.+)\)/.exec(program)) {
      expr = new Action({ type: TYPES.expression, args: this.parseArguments(match[2]), kind: 'c' + match[1]})
      this.ast.addAction(expr)
    } else {
      throw SyntaxError(`Unexpected syntax ${program}`)
    }
  
    return match
  }
  
  parseArguments (program) {
    let args = program.split(',').map(this.defineArgument.bind(this))
    return args
  }
  
  defineArgument (val) {
    let value = val.trim()
    let arg = {}
  
    if (this.ast.hasVol(value)) {
      arg = this.ast.getVol(value)
    } else if (String(value).charAt(0) === '"') {
      arg = new Primitive({ type: TYPES.string, value: String(value) })
    } else if (!isNaN(value)) {
      arg = new Primitive({ type: TYPES.number, value: Number(value) })
    }
  
    return arg
  }
}
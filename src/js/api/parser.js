import { excludeSpaces } from './utils'
import { Primitive, Action, MathExpression } from './entities'
import { TYPES } from './constants'

export class Parser {
  constructor(ast) {
    this.ast = ast
  }

  parseExpression(program) {
    let match
    program = excludeSpaces(program)

    if ((match = /^vol\s*(\w+)\s*=\s*(\d+)\b/.exec(program))) {
      this.parseNumber(match)
    } else if ((match = /^vol\s*(\w+)\s*=\s*"(\w+?)"/.exec(program))) {
      this.parseString(match)
    } else {
      match = this.parseAction(program)
    }

    let remainProgram = program.slice(match[0].length)
    if (remainProgram.length) {
      this.parseExpression(remainProgram)
    }
  }

  parseNumber(match) {
    let expr = new Primitive({ type: TYPES.number, name: match[1], value: Number(match[2]) })
    this.ast.addVol(expr)
  }

  parseString(match) {
    let expr = new Primitive({ type: TYPES.string, name: match[1], value: match[2] })
    this.ast.addVol(expr)
  }

  parseAction(program) {
    let match, expr
    program = excludeSpaces(program)

    if ((match = /^c\.(out|in)\((.+)\)/.exec(program))) {
      expr = new Action({ type: TYPES.expression, args: this.parseArguments(match[2]), kind: 'c' + match[1] })
      this.ast.addAction(expr)
    } else if (/\d*\.?\d*[+*/-]?\d*\.?\d*/g.test(program)) {
      match = [program] // Todo: Make smart regExp, with parsing to AST. Check babel parser realization.
      expr = this.parseMathExpression(program)
      this.ast.addAction(expr)
    } else {
      throw SyntaxError(`Unexpected syntax ${program}`)
    }

    return match
  }

  parseMathExpression(program) {
    if (!program) return
    let match, expr, subExpr

    let matchTests = [
      RegExp(/(?<restExp>.+?)(?<firstOp>[\+\-\*\/]?)(?<firstArg>(?<=[\+\-])\d+)?(?<secondOp>[\+\-])(?<secondArg>\d+)$/),
      RegExp(/(?<restExp>.+?)(?<firstOp>[\+\-\*\/]?)(?<firstArg>\d+)(?<secondOp>[\*\/])(?<secondArg>\d+)$/)
    ]

    for (let test of matchTests) {
      if ((match = test.exec(program))) {
        break
      }
    }

    console.log('program', program)
    console.log('match', match)

    const { restExp, firstOp, secondOp, firstArg, secondArg } = match.groups

    subExpr = new MathExpression({
      left: firstArg,
      operator: secondOp,
      right: secondArg,
    })

    expr = new MathExpression({
      left: this.parseMathExpression(restExp),
      operator: firstOp,
      right: subExpr,
    })

    // Return program to slice whole expression in initial @function parseExpression()
    return expr
  }

  parseArguments(program) {
    let args = program.split(',').map(this.defineArgument.bind(this))
    return args
  }

  defineArgument(val) {
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

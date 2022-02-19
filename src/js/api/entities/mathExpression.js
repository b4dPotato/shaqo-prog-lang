import { Action } from './action'
import { EXPRESSION_TYPES } from '../constants'

export class MathExpression extends Action {
  constructor({ args, kind, callee, left, right, operator }) {
    super({ type: EXPRESSION_TYPES.mathExpression, args, kind, callee })
    this._left = left
    this._operator = operator
    this._right = right
  }

  set operator(operator) {
    this._operator = operator
  }

  set left(left) {
    this._left = left
  }

  set right(right) {
    this._right = right
  }
  
  get operator() {
    return this._operator
  }

  get left() {
    return this._left
  }

  get right() {
    return this._right
  }
}

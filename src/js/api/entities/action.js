export class Action {
  constructor({ type, args, kind, callee }) {
    this._type = type
    this._args = args
    this._kind = kind
    this._callee = callee
  }

  set type(type) {
    this._type = type
  }

  set args(args) {
    this._args = args
  }

  set kind(kind) {
    this._kind = kind
  }

  set callee(callee) {
    this._callee = callee
  }

  get type() {
    return this._type
  }

  get args() {
    return this._args
  }

  get kind() {
    return this._kind
  }

  get callee() {
    return this._callee
  }
}

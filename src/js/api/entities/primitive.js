import { TYPES } from '../constants'
import { Exceptions } from './exceptions'
export class Primitive {
  constructor ({ name, type, value }) {
    this._name = name
    this._type = type
    this._value = value
  }

  set value (val) {
    if (this._type === TYPES.string) {
      this._value = String(val)
    } else if (this._type === TYPES.number && Number(val)) {
      this._value = Number(val)
    } else {
      Exceptions.typeError({ value: val, type: this._type })
    }
  }

  set name (name) {
    this._name = name
  }

  set type (type) {
    this._type = type
  }

  get value () {
    return this._value
  }

  get name () {
    return this._name
  }

  get type () {
    return this._type
  }
}
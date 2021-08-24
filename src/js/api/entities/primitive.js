import { TYPES } from '../constants'

export class Primitive {
  constructor ({ name, type, value }) {
    this._name = name
    this._type = type
    this._value = value

    if (!type) {
      this.defineType()
    }
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

  defineType () {
    if (String(this.value).charAt(0) === '"') {
      this.type = TYPES.string
    } else if (!isNaN(this.value)) {
      this.type = TYPES.number
    }
  }
}
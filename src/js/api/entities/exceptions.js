export default class Exceptions {
  static typeError ({ value, type }) {
    throw new TypeError(`Cannot set value ${value} of type ${type}`)
  }
  static primitiveAssignError ({ type }) {
    throw new Error(`Cannot set value of primitive type ${type}`)
  }
  static referenceError ({ name }) {
    throw new ReferenceError(`${name} is not defined`)
  }
}
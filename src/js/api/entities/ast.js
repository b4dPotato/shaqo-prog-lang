export class AST {
  constructor() {
    this.global = Object.create(null)
    this.stack = new Array()
  }

  addVol(vol) {
    this.global[vol.name] = vol
  }

  addAction(action) {
    this.stack.push(action)
  }

  hasVol(name) {
    return name in this.global
  }

  getVol(name) {
    return this.global[name]
  }
}

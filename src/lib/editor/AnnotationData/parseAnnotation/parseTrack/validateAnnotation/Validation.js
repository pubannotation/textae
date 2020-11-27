export default class Validation {
  constructor(nodes, predicate) {
    this._nodes = nodes || []
    this._predicate = predicate
  }

  get validNodes() {
    return this._nodes.filter((n) => this._predicate(n))
  }

  get invalidNodes() {
    return this._nodes.filter((n) => !this._predicate(n))
  }

  get invalid() {
    return this._nodes.some((n) => !this._predicate(n))
  }
}

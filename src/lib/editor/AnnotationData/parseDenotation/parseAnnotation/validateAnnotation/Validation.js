export default class {
  constructor(nodes, predicate) {
    this._nodes = nodes || []
    this._predicate = predicate
  }

  get validNodes() {
    return this._nodes.filter((val, index) => this._validate(val, index))
  }

  get invalidNodes() {
    return this._nodes.filter((val, index) => !this._validate(val, index))
  }

  get invalid() {
    return this._nodes.some((val, index) => !this._validate(val, index))
  }

  // Expansion point.
  // For example, IsNotCrossingValidation gets the previous node.
  _validate(currentNode) {
    return this._predicate(currentNode)
  }
}

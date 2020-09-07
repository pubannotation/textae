export default class {
  constructor(nodes, predicate) {
    this._nodes = nodes
    this._predicate = predicate
  }

  get validNodes() {
    if (!this._nodes) {
      return []
    }

    return this._nodes.filter((val, index) => this._validate(index, val))
  }

  get invalidNodes() {
    if (!this._nodes) {
      return []
    }

    return this._nodes.filter((val, index) => !this._validate(index, val))
  }

  _validate(index, currentNode) {
    // This variable only for isNotSpanCrossing.
    const prevNode = this._nodes.slice(0, index)

    return this._predicate(currentNode, prevNode)
  }
}

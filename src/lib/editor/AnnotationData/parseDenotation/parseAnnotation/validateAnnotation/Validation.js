export default class {
  constructor(nodes, predicate) {
    this._nodes = nodes
    this._predicate = predicate
  }

  get validNodes() {
    if (!this._nodes) {
      return []
    }

    return this._nodes.filter((target, index) => this._validate(index, target))
  }

  get invalidNodes() {
    if (!this._nodes) {
      return []
    }

    return this._nodes.filter((target, index) => !this._validate(index, target))
  }

  _validate(index, target) {
    // This variable only for isNotSpanCrossing.
    const nodesBeforeTarget = this._nodes.slice(0, index)

    return this._predicate(target, nodesBeforeTarget)
  }
}

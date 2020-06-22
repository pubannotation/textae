export default class {
  constructor() {
    this._acceptedNodes = []
    this._rejectedNodes = []
  }

  accept(node) {
    this._acceptedNodes.push(node)
  }

  reject(node) {
    this._rejectedNodes.push(node)
  }

  get acceptedNodes() {
    return this._acceptedNodes
  }

  get rejectedNodes() {
    return this._rejectedNodes
  }
}

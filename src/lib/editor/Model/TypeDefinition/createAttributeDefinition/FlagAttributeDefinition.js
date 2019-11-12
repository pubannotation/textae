export default class {
  constructor(hash) {
    this.pred = hash.pred
    this.default = hash.default
    this._label = hash.label
    this._color = hash.color
  }

  getLabel() {
    if (this._label) {
      return this._label
    }

    return this.pred
  }

  getColor() {
    return this._color
  }
}

export default class SourceAndTarget {
  constructor(source, target) {
    this._source = source
    this._target = target
  }

  get source() {
    return this._source
  }

  get target() {
    return this._target
  }

  get horizontalDistance() {
    return Math.abs(this._target.x - this._source.x)
  }

  get isDownward() {
    return this._source.y < this._target.y
  }
}

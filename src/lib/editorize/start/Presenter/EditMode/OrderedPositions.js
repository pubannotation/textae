export default class OrderedPositions {
  constructor(positions) {
    this._positions = positions
  }

  // switch the position when the selection is made from right to left
  get begin() {
    if (this._positions.anchor < this._positions.focus) {
      return this._positions.anchor
    }

    return this._positions.focus
  }

  // switch the position when the selection is made from right to left
  get end() {
    if (this._positions.anchor < this._positions.focus) {
      return this._positions.focus
    }

    return this._positions.anchor
  }
}

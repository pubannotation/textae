export default class {
  constructor(gridPosition) {
    this._gridPosition = gridPosition
  }

  getGrid(id) {
    return this._gridPosition.get(id)
  }

  setGrid(id, val) {
    this._gridPosition.set(id, val)
  }
}

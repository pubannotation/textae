export default class Pointer {
  constructor() {
    this.reset()
  }

  reset() {
    this._lastEdit = -1
    this._lastSave = -1
  }

  save() {
    this._lastSave = this._lastEdit
  }

  set lastEdit(index) {
    this._lastEdit = index
  }

  get hasAnythingToSave() {
    return this._lastEdit !== this._lastSave
  }
}

import add from './add'
import single from './single'
import remove from './remove'
import clear from './clear'

export default class {
  constructor(emitter, kindName, annotationData) {
    this._emitter = emitter
    this._kindName = kindName
    this._selected = new Set()
    this._annotationData = annotationData
  }

  add(id) {
    add(this._selected, this._emitter, this._kindName, this._toModel(id))
  }

  has(id) {
    return this._selected.has(id)
  }

  get all() {
    return Array.from(this._selected.values()).map((id) => this._toModel(id))
  }

  get size() {
    return this._selected.size
  }

  get some() {
    return this.size > 0
  }

  get singleId() {
    return single(this._selected)
  }

  get single() {
    const id = single(this._selected)

    if (id) {
      return this._toModel(id)
    }

    return null
  }

  toggle(id) {
    if (this._selected.has(id)) {
      this.remove(id)
    } else {
      this.add(id)
    }
  }

  remove(id) {
    remove(this._selected, this._emitter, this._kindName, this._toModel(id))
  }

  removeInstance(modelInstance) {
    remove(this._selected, this._emitter, this._kindName, modelInstance)
  }

  clear() {
    clear(this._selected, this._emitter, this._kindName, (id) =>
      this._toModel(id)
    )
  }

  _toModel(id) {
    return this._annotationData[this._kindName].get(id)
  }
}

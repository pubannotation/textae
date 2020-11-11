import remove from './remove'
import triggerChange from './triggerChange'

export default class {
  constructor(emitter, kindName, annotationData) {
    this._emitter = emitter
    this._kindName = kindName
    this._selected = new Set()
    this._annotationData = annotationData
  }

  add(id) {
    if (this._selected.has(id)) {
      return
    }

    this._selected.add(id)
    this._toModel(id).select()

    triggerChange(this._emitter, this._kindName)
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
    return this._selected.size === 1
      ? this._selected.values().next().value
      : null
  }

  get single() {
    const id = this.singleId

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
    if (this._selected.size === 0) return

    this._selected.forEach((id) => this.remove(id))

    triggerChange(this._emitter, this._kindName)
  }

  _toModel(id) {
    return this._annotationData[this._kindName].get(id)
  }
}

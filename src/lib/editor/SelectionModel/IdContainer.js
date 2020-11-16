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
    this._triggerChange()
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
    const modelInstance = this._toModel(id)
    this.removeInstance(modelInstance)
  }

  removeInstance(modelInstance) {
    if (this._selected.has(modelInstance.id)) {
      this._selected.delete(modelInstance.id)
      modelInstance.deselect()
      this._triggerChange()
    }
  }

  clear() {
    if (this._selected.size === 0) return

    for (const id of this._selected) {
      this._selected.delete(id)

      // When the annotation is loaded, the model instance cannot be taken.
      if (this._toModel(id)) {
        this._toModel(id).deselect()
      }
    }

    this._triggerChange()
  }

  _toModel(id) {
    return this._annotationData[this._kindName].get(id)
  }

  _triggerChange() {
    this._emitter.emit(`textae.selection.${this._kindName}.change`)
  }
}

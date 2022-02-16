export default class SelectedItems {
  constructor(emitter, kindName, annotationData) {
    this._emitter = emitter
    this._kindName = kindName
    this._selected = new Map()
    this._annotationData = annotationData
  }

  add(id) {
    if (this._selected.has(id)) {
      return
    }

    const modelInstance = this._annotationData[this._kindName].get(id)

    console.assert(
      modelInstance,
      `${id} is not a instance of ${this._kindName}.`
    )

    this._selected.set(id, modelInstance)
    modelInstance.select()
    this._triggerChange()
  }

  has(id) {
    const modelInstance = this._annotationData[this._kindName].get(id)

    if (modelInstance) {
      return modelInstance.isSelected
    }

    return false
  }

  contains(predicate) {
    for (const v of this._selected.values()) {
      if (predicate(v)) {
        return true
      }
    }

    return false
  }

  get all() {
    return Array.from(this._selected.values())
  }

  get size() {
    return this._selected.size
  }

  get some() {
    return this.size > 0
  }

  get singleId() {
    return this._selected.size === 1 ? this._selected.keys().next().value : null
  }

  get single() {
    const id = this.singleId

    if (id) {
      return this._selected.get(id)
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
    if (this._selected.has(id)) {
      this._selected.get(id).deselect()
      this._selected.delete(id)
      this._triggerChange()
    }
  }

  removeInstance(modelInstance) {
    this.remove(modelInstance.id)
  }

  removeAll() {
    if (this._selected.size === 0) return

    for (const [id] of this._selected) {
      this._selected.get(id).deselect()
      this._selected.delete(id)
    }

    this._triggerChange()
  }

  clear() {
    this._selected.clear()
  }

  _triggerChange() {
    this._emitter.emit(`textae-event.selection.${this._kindName}.change`)
  }
}

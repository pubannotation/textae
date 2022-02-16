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
    for (const v of this._annotationData[this._kindName].selectedItems) {
      if (predicate(v)) {
        return true
      }
    }

    return false
  }

  get all() {
    return this._annotationData[this._kindName].selectedItems
  }

  get size() {
    return this._annotationData[this._kindName].selectedItems.length
  }

  get some() {
    return this.size > 0
  }

  get singleId() {
    const instance = this.single
    if (instance) {
      return instance.id
    }

    return null
  }

  get single() {
    return this.size === 1
      ? this._annotationData[this._kindName].selectedItems[0]
      : null
  }

  toggle(id) {
    if (this.has(id)) {
      this.remove(id)
    } else {
      this.add(id)
    }
  }

  remove(id) {
    if (this.has(id)) {
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

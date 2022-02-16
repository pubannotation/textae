export default class SelectedItems {
  constructor(emitter, kindName, annotationData) {
    this._emitter = emitter
    this._kindName = kindName
    this._annotationData = annotationData
  }

  add(id) {
    const modelInstance = this._annotationData[this._kindName].get(id)

    console.assert(
      modelInstance,
      `${id} is not a instance of ${this._kindName}.`
    )

    if (modelInstance.isSelected) {
      return
    }

    modelInstance.select()
    this.triggerChange()
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
      this._annotationData[this._kindName].get(id).deselect()
      this.triggerChange()
    }
  }

  removeInstance(modelInstance) {
    this.remove(modelInstance.id)
  }

  removeAll() {
    if (this.size === 0) return

    for (const instance of this.all) {
      instance.deselect()
    }

    this.triggerChange()
  }

  triggerChange() {
    this._emitter.emit(`textae-event.selection.${this._kindName}.change`)
  }
}

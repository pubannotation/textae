export default class SelectedItems {
  constructor(emitter, annotationType, annotationData) {
    this._emitter = emitter
    this._annotationType = annotationType
    this._instanceContainer = annotationData[annotationType]
  }

  add(id) {
    const instance = this._instanceContainer.get(id)

    console.assert(
      instance,
      `${id} is not a instance of ${this._annotationType}.`
    )

    if (instance.isSelected) {
      return
    }

    instance.select()
    this.triggerChange()
  }

  has(id) {
    const instance = this._instanceContainer.get(id)

    if (instance) {
      return instance.isSelected
    }

    return false
  }

  contains(predicate) {
    for (const v of this._instanceContainer.selectedItems) {
      if (predicate(v)) {
        return true
      }
    }

    return false
  }

  get all() {
    return this._instanceContainer.selectedItems
  }

  get size() {
    return this._instanceContainer.selectedItems.length
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
    return this.size === 1 ? this._instanceContainer.selectedItems[0] : null
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
      this._instanceContainer.get(id).deselect()
      this.triggerChange()
    }
  }

  removeInstance(instance) {
    this.remove(instance.id)
  }

  removeAll() {
    if (this.size === 0) return

    for (const instance of this.all) {
      instance.deselect()
    }

    this.triggerChange()
  }

  triggerChange() {
    this._emitter.emit(`textae-event.selection.${this._annotationType}.change`)
  }
}

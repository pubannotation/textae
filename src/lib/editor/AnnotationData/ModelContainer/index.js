import isFunction from './isFunction'
import addToContainer from './addToContainer'

export default class {
  constructor(emitter, name, mappingFunction = null, idPrefix = null) {
    this._emitter = emitter
    this._name = name

    // If mappingFunction is not specified, set a function that does not change anything.
    this._mappingFunction = mappingFunction || ((v) => v)

    // If idPrefix is specified, overwrite prefix.
    this._idPrefix = idPrefix ? idPrefix : name.charAt(0).toUpperCase()

    this._container = new Map()
  }

  addSource(source) {
    const collection = this._mappingFunction(source)

    if (!collection) return

    // Move medols without id behind others, to prevet id duplication generated and exists.
    collection.sort((a, b) => {
      if (!a.id) return 1
      if (!b.id) return -1
      if (a.id < b.id) return -1
      if (a.id > b.id) return 1

      return 0
    })

    collection.forEach((instance) => this._addToContainer(instance))
  }

  // The doAfter is avoked before a event emitted.
  add(instance, doAfter) {
    const newInstance = this._addToContainer(instance)
    if (isFunction(doAfter)) doAfter(newInstance)

    this._emit(`textae.annotationData.${this._name}.add`, newInstance)
    return newInstance
  }

  get(id) {
    return this._container.get(id)
  }

  get all() {
    return Array.from(this._container.values())
  }

  findByType(typeName) {
    return this.all.filter((model) => model.typeName === typeName)
  }

  get some() {
    return this._container.size
  }

  changeType(id, newType) {
    const instance = this._container.get(id)
    instance.typeName = newType
    this._emit(`textae.annotationData.${this._name}.change`, instance)
    return instance
  }

  remove(id) {
    const instance = this._container.get(id)
    if (instance) {
      this._container.delete(id)
      this._emit(`textae.annotationData.${this._name}.remove`, instance)
    }
    return instance
  }

  clear() {
    this._container.clear()
  }

  _addToContainer(instance) {
    return addToContainer(instance, this._container, this._idPrefix)
  }

  _emit(event, data) {
    this._emitter.emit(event, data)
  }
}

import isFunction from './isFunction'
import addToContainer from './addToContainer'

export default class {
  constructor(emitter, prefix, mappingFunction = null, idPrefix = null) {
    this._emitter = emitter
    this.name = prefix

    // If mappingFunction is not specified, set a function that does not change anything.
    this.mappingFunction = mappingFunction || ((v) => v)

    // If idPrefix is specified, overwrite prefix.
    this.prefix = idPrefix ? idPrefix : prefix.charAt(0).toUpperCase()

    this.container = new Map()
  }

  addSource(source) {
    const collection = this.mappingFunction(source)

    if (!collection) return

    // Move medols without id behind others, to prevet id duplication generated and exists.
    collection.sort((a, b) => {
      if (!a.id) return 1
      if (!b.id) return -1
      if (a.id < b.id) return -1
      if (a.id > b.id) return 1

      return 0
    })

    collection.forEach((instance) =>
      addToContainer(instance, this.container, this.prefix)
    )
  }

  // The doAfter is avoked before a event emitted.
  add(instance, doAfter) {
    const newInstance = addToContainer(instance, this.container, this.prefix)
    if (isFunction(doAfter)) doAfter(newInstance)

    this._emitter.emit(`${this.name}.add`, newInstance)
    return newInstance
  }

  get(id) {
    return this.container.get(id)
  }

  get all() {
    return Array.from(this.container.values())
  }

  get some() {
    return this.container.size
  }

  changeType(id, newType) {
    const instance = this.container.get(id)
    instance.type = newType
    this._emitter.emit(`${this.name}.change`, instance)
    return instance
  }

  remove(id) {
    const instance = this.container.get(id)
    if (instance) {
      this.container.delete(id)
      this._emitter.emit(`${this.name}.remove`, instance)
    }
    return instance
  }

  clear() {
    this.container.clear()
  }
}

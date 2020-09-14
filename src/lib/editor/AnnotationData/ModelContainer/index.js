import isFunction from './isFunction'

export default class {
  constructor(emitter, name) {
    this._emitter = emitter
    this._name = name
    this._container = new Map()
  }

  _toModels(rowData) {
    return rowData
  }

  addSource(source) {
    for (const instance of this._toModels(source)) {
      this._addToContainer(instance)
    }
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
    this._container.set(instance.id, instance)
    return instance
  }

  _emit(event, data) {
    this._emitter.emit(event, data)
  }
}

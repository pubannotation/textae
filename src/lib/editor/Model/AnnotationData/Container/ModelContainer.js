import getNextId from './getNextId'

const ERROR_MESSAGE =
  'Set the mappingFunction by the constructor to use the method "ModelContainer.addSource".'

export default class {
  constructor(emitter, prefix, mappingFunction, idPrefix) {
    if (!isFunction(mappingFunction)) {
      throw new Error(ERROR_MESSAGE)
    }

    this.emitter = emitter
    this.name = prefix
    this.mappingFunction = mappingFunction
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

    this.emitter.emit(`${this.name}.add`, newInstance)
    return newInstance
  }

  get(id) {
    return this.container.get(id)
  }

  all() {
    return Array.from(this.container.values())
  }

  some() {
    return this.container.size
  }

  types() {
    return Array.from(this.container.values()).map((instance) => instance.type)
  }

  changeType(id, newType) {
    const instance = this.container.get(id)
    instance.type = newType
    this.emitter.emit(`${this.name}.change`, instance)
    return instance
  }

  remove(id) {
    const instance = this.container.get(id)
    if (instance) {
      this.container.delete(id)
      this.emitter.emit(`${this.name}.remove`, instance)
    }
    return instance
  }

  clear() {
    this.container.clear()
  }
}

// see: https://stackoverflow.com/questions/5999998/check-if-a-variable-is-of-function-type
function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  )
}

function addToContainer(instance, container, prefix) {
  if (!instance.id) {
    // Overwrite to revert
    const ids = Array.from(container.keys())
    const newId = getNextId(prefix, ids)
    instance.id = newId
  }
  container.set(instance.id, instance)
  return instance
}

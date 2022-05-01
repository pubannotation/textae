import ModelContainer from '../ModelContainer'

export default class IdIssueContainer extends ModelContainer {
  constructor(emitter, name, prefixFunc) {
    super(emitter, name)

    this._prefixFunc = prefixFunc
  }

  addSource(source, type) {
    const collection = source.map((r) => this._toModel(r, type))

    // Move medols without id behind others, to prevet id duplication generated and exists.
    collection.sort((a, b) => {
      if (!a.id) return 1
      if (!b.id) return -1
      if (a.id < b.id) return -1
      if (a.id > b.id) return 1

      return 0
    })

    for (const instance of collection) {
      super._addToContainer(this._assignID(instance))
    }
  }

  add(instance) {
    return super.add(this._assignID(instance))
  }

  _assignID(instance) {
    if (!instance.id) {
      // Overwrite to revert
      const ids = Array.from(this._container.keys())
      const newId = getNextId(this._prefixFunc(instance), ids)
      instance.id = newId
    }
    return instance
  }
}

function getNextId(prefix, existsIds) {
  // The format of id is a prefix and a number, for exapmle 'T1'.
  const numbers = existsIds
    .filter((id) => new RegExp(`^${prefix}\\d+$`).test(id))
    .map((id) => id.slice(1))

  // The Math.max retrun -Infinity when the second argument array is empty.
  const max = numbers.length === 0 ? 0 : Math.max(...numbers)

  return prefix + (max + 1)
}

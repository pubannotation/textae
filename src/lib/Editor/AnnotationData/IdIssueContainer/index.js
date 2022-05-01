import ModelContainer from '../ModelContainer'
import getNextId from './getNextId'

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
      super._addToContainer(this._issueId(instance))
    }
  }

  add(instance) {
    return super.add(this._issueId(instance))
  }

  _issueId(instance) {
    if (!instance.id) {
      // Overwrite to revert
      const ids = Array.from(this._container.keys())
      const newId = getNextId(this._prefixFunc(instance), ids)
      instance.id = newId
    }
    return instance
  }
}

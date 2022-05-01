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
      super._addToContainer(
        issueId(instance, this._container, this._prefixFunc(instance))
      )
    }
  }

  add(instance) {
    return super.add(issueId(instance, this._container, this._prefixFunc(instance)))
  }
}

function issueId(instance, container, prefix) {
  if (!instance.id) {
    // Overwrite to revert
    const ids = Array.from(container.keys())
    const newId = getNextId(prefix, ids)
    instance.id = newId
  }
  return instance
}

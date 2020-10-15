import issueId from './issueId'
import ModelContainer from '../ModelContainer'

export default class IdIssueContainer extends ModelContainer {
  constructor(emitter, name, prefix) {
    super(emitter, name)

    this._prefix = prefix
  }

  _toModels(rowDatum, type) {
    const collection = super._toModels(rowDatum, type)

    // Move medols without id behind others, to prevet id duplication generated and exists.
    collection.sort((a, b) => {
      if (!a.id) return 1
      if (!b.id) return -1
      if (a.id < b.id) return -1
      if (a.id > b.id) return 1

      return 0
    })

    return collection
  }

  _addToContainer(instance) {
    return super._addToContainer(
      issueId(instance, this._container, this._prefix)
    )
  }
}

import ModelContainer from '../ModelContainer'
import issueId from '../issueId'
import RelationModel from './RelationModel'

export default class extends ModelContainer {
  constructor(emitter) {
    super(emitter, 'relation')
  }

  _toModel(relation) {
    return new RelationModel(relation)
  }

  _toModels(relations) {
    const collection = super._toModels(relations)

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

  add(relation) {
    // When redoing, the relation is instance of the RelationModel already.
    if (relation instanceof RelationModel) {
      return super.add(relation)
    }

    return super.add(this._toModel(relation))
  }

  _addToContainer(instance) {
    return super._addToContainer(issueId(instance, this._container, 'R'))
  }
}

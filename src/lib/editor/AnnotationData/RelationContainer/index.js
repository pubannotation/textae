import ModelContainer from '../ModelContainer'
import issueId from '../issueId'
import RelationModel from './RelationModel'

export default class extends ModelContainer {
  constructor(emitter) {
    super(emitter, 'relation')
  }

  _toModels(relations) {
    const collection = relations.map((r) => new RelationModel(r))

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

    return super.add(new RelationModel(relation))
  }

  _addToContainer(instance) {
    return super._addToContainer(issueId(instance, this._container, 'R'))
  }
}

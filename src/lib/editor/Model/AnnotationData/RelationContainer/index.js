import ModelContainer from '../ModelContainer'
import RelationModel from './RelationModel'

export default class extends ModelContainer {
  constructor(emitter) {
    super(emitter, 'relation', (relations) =>
      relations.map((r) => new RelationModel(r))
    )
  }

  add(relation) {
    // When redoing, the relation is instance of the RelationModel already.
    if (relation instanceof RelationModel) {
      return super.add(relation)
    }

    return super.add(new RelationModel(relation))
  }
}

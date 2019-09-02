import ModelContainer from '../ModelContainer'
import RelationModel from './RelationModel'

export default class extends ModelContainer {
  constructor(emitter) {
    super(emitter, 'relation', (relations) =>
      relations.map((r) => new RelationModel(r))
    )
  }
}

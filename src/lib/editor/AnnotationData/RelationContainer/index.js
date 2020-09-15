import RelationModel from './RelationModel'
import IdIssueContainer from '../IdIssueContainer'

export default class extends IdIssueContainer {
  constructor(emitter) {
    super(emitter, 'relation', 'R')
  }

  _toModel(relation) {
    return new RelationModel(relation)
  }

  add(relation) {
    // When redoing, the relation is instance of the RelationModel already.
    if (relation instanceof RelationModel) {
      return super.add(relation)
    }

    return super.add(this._toModel(relation))
  }
}

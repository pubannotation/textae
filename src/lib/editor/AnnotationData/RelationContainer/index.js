import RelationModel from './RelationModel'
import IdIssueContainer from '../IdIssueContainer'

export default class extends IdIssueContainer {
  constructor(emitter) {
    super(emitter, 'relation', 'R')
  }

  _toModel(relation) {
    return new RelationModel(relation)
  }

  add(newValue) {
    // When redoing, the relation is instance of the RelationModel already.
    if (newValue instanceof RelationModel) {
      return super.add(newValue)
    }

    return super.add(this._toModel(newValue))
  }
}

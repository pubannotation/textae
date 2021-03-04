import RelationModel from './RelationModel'
import IdIssueContainer from '../IdIssueContainer'

export default class RelationContainer extends IdIssueContainer {
  constructor(editor, emitter) {
    super(emitter, 'relation', 'R')
    this._editor = editor
  }

  _toModel(relation) {
    return new RelationModel(this._editor, relation)
  }

  add(newValue) {
    // When redoing, the newValue is instance of the RelationModel already.
    if (newValue instanceof RelationModel) {
      return super.add(newValue)
    }

    return super.add(this._toModel(newValue))
  }

  clear() {
    for (const relation of this.all) {
      relation.destroyElement()
    }
    super.clear()
  }
}

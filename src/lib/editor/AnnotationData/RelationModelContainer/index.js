import RelationModel from './RelationModel'
import IdIssueContainer from '../IdIssueContainer'

export default class RelationModelContainer extends IdIssueContainer {
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

    return super.add(new RelationModel(this._editor, newValue))
  }

  clear() {
    for (const relation of this.all) {
      relation.destroyElement()
    }
    super.clear()
  }
}

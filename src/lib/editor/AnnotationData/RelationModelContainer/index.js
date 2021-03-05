import RelationModel from './RelationModel'
import IdIssueContainer from '../IdIssueContainer'

export default class RelationModelContainer extends IdIssueContainer {
  constructor(editor, emitter, namespace, definitionContainer) {
    super(emitter, 'relation', 'R')
    this._editor = editor
    this._namespace = namespace
    this._definitionContainer = definitionContainer
  }

  _toModel(relation) {
    return new RelationModel(
      this._editor,
      relation,
      this._namespace,
      this._definitionContainer
    )
  }

  add(newValue) {
    // When redoing, the newValue is instance of the RelationModel already.
    if (newValue instanceof RelationModel) {
      return super.add(newValue)
    }

    return super.add(
      new RelationModel(
        this._editor,
        newValue,
        this._namespace,
        this._definitionContainer
      )
    )
  }

  clear() {
    for (const relation of this.all) {
      relation.destroyElement()
    }
    super.clear()
  }
}

import RelationModel from './RelationModel'
import IdIssueContainer from '../IdIssueContainer'

export default class RelationModelContainer extends IdIssueContainer {
  constructor(
    editor,
    emitter,
    parentContainer,
    namespace,
    definitionContainer
  ) {
    super(emitter, 'relation', 'R')
    this._editor = editor
    this._parentContainer = parentContainer
    this._namespace = namespace
    this._definitionContainer = definitionContainer
  }

  _toModel(relation) {
    return new RelationModel(
      this._editor,
      this._parentContainer.entity,
      this._parentContainer.attribute,
      relation,
      this._namespace,
      this._definitionContainer
    )
  }

  add(newValue) {
    // When redoing, the newValue is instance of the RelationModel already.
    newValue =
      newValue instanceof RelationModel
        ? newValue
        : new RelationModel(
            this._editor,
            this._parentContainer.entity,
            this._parentContainer.attribute,
            newValue,
            this._namespace,
            this._definitionContainer
          )
    newValue.renderElement()
    return super.add(newValue)
  }

  changeType(id, newType) {
    const relation = super.changeType(id, newType)
    relation.updateElement()
    return relation
  }

  remove(id) {
    const relation = super.remove(id)
    relation.destroyElement()
    return relation
  }

  clear() {
    for (const relation of this.all) {
      relation.destroyElement()
    }
    super.clear()
  }
}

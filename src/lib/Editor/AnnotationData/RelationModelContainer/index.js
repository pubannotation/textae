import RelationModel from './RelationModel'
import IdIssueContainer from '../IdIssueContainer'

export default class RelationModelContainer extends IdIssueContainer {
  constructor(
    editorHTMLElement,
    eventEmitter,
    parentContainer,
    namespace,
    definitionContainer
  ) {
    super(eventEmitter, 'relation', 'R')
    this._editorHTMLElement = editorHTMLElement
    this._eventEmitter = eventEmitter
    this._parentContainer = parentContainer
    this._namespace = namespace
    this._definitionContainer = definitionContainer
  }

  _toModel(relation) {
    return new RelationModel(
      this._editorHTMLElement,
      this._eventEmitter,
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
            this._editorHTMLElement,
            this._eventEmitter,
            this._parentContainer.entity,
            this._parentContainer.attribute,
            newValue,
            this._namespace,
            this._definitionContainer
          )
    newValue.render()
    return super.add(newValue)
  }

  changeType(id, newType) {
    const relation = super.changeType(id, newType)
    relation.updateElement()
    return relation
  }

  remove(id) {
    console.assert(id, 'id is necessary!')
    const relation = super.remove(id)
    relation.erase()
  }

  clear() {
    for (const relation of this.all) {
      relation.erase()
    }
    super.clear()
  }
}

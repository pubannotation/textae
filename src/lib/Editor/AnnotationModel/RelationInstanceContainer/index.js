import RelationInstance from './RelationInstance'
import IdIssueContainer from '../IdIssueContainer'

export default class RelationInstanceContainer extends IdIssueContainer {
  constructor(
    editorHTMLElement,
    eventEmitter,
    parentContainer,
    namespace,
    definitionContainer
  ) {
    super(eventEmitter, 'relation', () => 'R')
    this._editorHTMLElement = editorHTMLElement
    this._eventEmitter = eventEmitter
    this._parentContainer = parentContainer
    this._namespace = namespace
    this._definitionContainer = definitionContainer
  }

  /** @param {number} value */
  set controlBarHeight(value) {
    this._controlBarHeight = value
  }

  _toInstance(relation) {
    return new RelationInstance(
      this._editorHTMLElement,
      this._eventEmitter,
      this._parentContainer.entity,
      this._parentContainer.attribute,
      relation,
      this._namespace,
      this._definitionContainer,
      this._controlBarHeight
    )
  }

  add(newValue) {
    // When redoing, the newValue is instance of the RelationInstance already.
    newValue =
      newValue instanceof RelationInstance
        ? newValue
        : new RelationInstance(
            this._editorHTMLElement,
            this._eventEmitter,
            this._parentContainer.entity,
            this._parentContainer.attribute,
            newValue,
            this._namespace,
            this._definitionContainer,
            this._controlBarHeight
          )
    const newInstance = super.add(newValue)

    const { clientHeight, clientWidth } = document.documentElement
    newInstance.render(clientHeight, clientWidth)

    return newInstance
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

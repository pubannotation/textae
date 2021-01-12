import Container from './Container'

export default class EntityContainer extends Container {
  constructor(
    editor,
    getAllInstanceFunc,
    attributeContainer,
    lockStateObservable
  ) {
    super(editor, 'entity', getAllInstanceFunc, lockStateObservable, '#77DDDD')
    this._attributeContainer = attributeContainer
  }

  get attributes() {
    return this._attributeContainer.attributes
  }

  isSelectionAttributeIndelible(pred, id) {
    return this._attributeContainer.isSelectionAttributeValueIndelible(pred, id)
  }
}

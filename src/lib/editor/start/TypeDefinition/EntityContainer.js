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

  set definedTypes(value) {
    const [entities, attributes] = value
    super.definedTypes = entities || []
    this._attributeContainer.definedTypes = attributes
  }

  createAttribute(attrDef, index) {
    this._attributeContainer.create(attrDef, index)
  }

  findAttribute(pred) {
    return this._attributeContainer.get(pred)
  }

  updateAttribute(oldPred, attrDef) {
    return this._attributeContainer.update(oldPred, attrDef)
  }

  moveAttribute(oldIndex, newIndex) {
    this._attributeContainer.move(oldIndex, newIndex)
  }

  deleteAttribute(pred) {
    this._attributeContainer.delete(pred)
  }

  get attributes() {
    return this._attributeContainer.attributes
  }

  get definedTypes() {
    return this._definedTypes
  }

  hasAttributeInstance(pred) {
    return this._attributeContainer.hasInstance(pred)
  }

  isSelectionAttributeIndelible(pred, id) {
    return this._attributeContainer.isSelectionAttributeValueIndelible(pred, id)
  }

  getAttributeLabel(attribute) {
    return this._attributeContainer.getLabel(attribute)
  }

  getAttributeColor(attribute) {
    return this._attributeContainer.getColor(attribute)
  }

  getIndexOfAttribute(pred) {
    return this._attributeContainer.getIndexOf(pred)
  }

  getAttributeAt(number) {
    return this._attributeContainer.getAttributeAt(number)
  }
}

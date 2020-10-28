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

  findAttribute(pred) {
    return this._attributeContainer.get(pred)
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
}

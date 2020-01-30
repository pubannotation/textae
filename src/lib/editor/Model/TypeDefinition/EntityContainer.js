import Container from './Container'
import createAttributeDefinition from './createAttributeDefinition'

export default class extends Container {
  constructor(editor, annotationDataEntity, lockStateObservable) {
    super(
      editor,
      'entity',
      () => annotationDataEntity.all,
      lockStateObservable,
      '#77DDDD'
    )
    this._annotationDataEntity = annotationDataEntity
  }

  set definedTypes(value) {
    const [entities, attributes] = value
    super.definedTypes = entities || []
    this._annotationDataEntity.definedTypes = this.definedTypes
    this._annotationDataEntity.definedAttributes = attributes

    this._definedAttributes = new Map(
      (attributes || []).map((a) => [a.pred, createAttributeDefinition(a)])
    )
  }

  get definedTypes() {
    return this._definedTypes
  }

  isBlock(typeName) {
    return this._definedTypes.isBlock(typeName)
  }

  getAttributeLabel(attribute) {
    if (this._definedAttributes.has(attribute.pred)) {
      return this._definedAttributes.get(attribute.pred).getLabel(attribute.obj)
    }

    return
  }

  getAttributeColor(attribute) {
    if (this._definedAttributes.has(attribute.pred)) {
      return this._definedAttributes.get(attribute.pred).getColor(attribute.obj)
    }
  }

  getAttributeAt(number) {
    return Array.from(this._definedAttributes.values())[number - 1]
  }
}

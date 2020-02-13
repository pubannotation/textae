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

    this._definedAttributes = new Map(
      (attributes || []).map((a) => [a.pred, createAttributeDefinition(a)])
    )
  }

  createAttribute(attrDef, index = null) {
    // To restore the position of a deleted attribute,
    // insert the new attribute at the specified index, if specified.
    // Note: 0 is false in JavaScript
    if (index !== null) {
      this._definedAttributes = new Map(
        Array.from(this._definedAttributes.entries()).reduce(
          (acc, [key, val], i) => {
            if (i === index) {
              acc.push([attrDef.pred, createAttributeDefinition(attrDef)])
            }
            acc.push([key, val])

            return acc
          },
          []
        )
      )
    } else {
      this._definedAttributes.set(
        attrDef.pred,
        createAttributeDefinition(attrDef)
      )
    }

    this._editor.eventEmitter.emit(
      `textae.typeDefinition.entity.attributeDefinition.create`,
      attrDef.pred
    )
  }

  updateAttribute(oldPred, attrDef) {
    // Predicate as key of map may be changed.
    // Keep oreder of attributes.
    // So that re-create an map instance.
    this._definedAttributes = new Map(
      Array.from(this._definedAttributes.entries()).map(([key, val]) => {
        if (key === oldPred) {
          return [attrDef.pred, createAttributeDefinition(attrDef)]
        } else {
          return [key, val]
        }
      })
    )

    this._editor.eventEmitter.emit(
      `textae.typeDefinition.entity.attributeDefinition.change`,
      attrDef.pred
    )

    return this._definedAttributes.get(attrDef.pred)
  }

  deleteAttribute(pred) {
    this._definedAttributes.delete(pred)
    this._editor.eventEmitter.emit(
      `textae.typeDefinition.entity.attributeDefinition.delete`
    )
  }

  get attributes() {
    return Array.from(this._definedAttributes.values()) || []
  }

  get definedTypes() {
    return this._definedTypes
  }

  isBlock(typeName) {
    return this._definedTypes.isBlock(typeName)
  }

  hasAttributeInstance(pred) {
    return this._annotationDataEntity.attributeContainer.all.some(
      (a) => a.pred === pred
    )
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

  getIndexOfAttribute(pred) {
    return Array.from(this._definedAttributes.values()).findIndex(
      (a) => a.pred === pred
    )
  }

  getAttributeAt(number) {
    return Array.from(this._definedAttributes.values())[number - 1]
  }
}

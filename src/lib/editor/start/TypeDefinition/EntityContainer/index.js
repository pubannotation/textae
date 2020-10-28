import arrayMove from 'array-move'
import Container from '../Container'
import createAttributeDefinition from './createAttributeDefinition'

export default class EntityContainer extends Container {
  constructor(
    editor,
    annotationDataEntity,
    annotationDataAttribute,
    lockStateObservable
  ) {
    super(
      editor,
      'entity',
      () => annotationDataEntity.all,
      lockStateObservable,
      '#77DDDD'
    )
    this._annotationDataAttribute = annotationDataAttribute
  }

  set definedTypes(value) {
    const [entities, attributes] = value
    super.definedTypes = entities || []
    this._definedAttributes = new Map(
      (attributes || []).map((a) => [a.pred, createAttributeDefinition(a)])
    )
  }

  createAttribute(attrDef, index = null) {
    // To restore the position of a deleted attribute,
    // insert the new attribute at the specified index, if specified.
    // Note: 0 is false in JavaScript
    // When index and the number of attribute definitions are the same,
    // the position of the deleted definition is the last. Add to the end of the attribute definition.
    if (index !== null && this._definedAttributes.size !== index) {
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

  findAttribute(pred) {
    return this._definedAttributes.get(pred)
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

    return this.findAttribute(attrDef.pred)
  }

  moveAttribute(oldIndex, newIndex) {
    this._definedAttributes = new Map(
      arrayMove(this.attributes, oldIndex, newIndex).map((a) => [a.pred, a])
    )

    // When an attribute definition move is undoed,
    // it fires an event to notify the palette to immediately reflect the display content.
    this._editor.eventEmitter.emit(
      `textae.typeDefinition.entity.attributeDefinition.move`
    )
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

  get attributeConfig() {
    return this.attributes.map((a) => a.JSON)
  }

  hasAttributeInstance(pred) {
    return this._annotationDataAttribute.all.some((a) => a.pred === pred)
  }

  isSelectionAttributeIndelible(pred, id) {
    if (this.findAttribute(pred).hasOnlyOneValue) {
      return true
    }

    // If there is an instance that uses a selection attribute, do not delete it.
    if (
      this._annotationDataAttribute.all.some(
        (a) => a.pred === pred && a.obj == id
      )
    ) {
      return true
    }

    return false
  }

  getAttributeLabel(attribute) {
    if (this._definedAttributes.has(attribute.pred)) {
      return this.findAttribute(attribute.pred).getLabel(attribute.obj)
    }

    return
  }

  getAttributeColor(attribute) {
    if (this._definedAttributes.has(attribute.pred)) {
      return this.findAttribute(attribute.pred).getColor(attribute.obj)
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

import { arrayMoveImmutable } from 'array-move'

import createAttributeDefinition from './createAttributeDefinition'

export default class AttributeDefinitionContainer {
  #eventEmitter
  #getAllInstanceFunc
  #definedTypes = new Map()

  constructor(eventEmitter, getAllInstanceFunc) {
    this.#eventEmitter = eventEmitter
    this.#getAllInstanceFunc = getAllInstanceFunc
  }

  get config() {
    return this.attributes.map((a) => a.externalFormat)
  }

  set config(attributes) {
    this.#definedTypes = new Map(
      (attributes || []).map((a) => [
        a.pred,
        createAttributeDefinition(a['value type'], a)
      ])
    )
  }

  create(valueType, attrDef, index = null) {
    // To restore the position of a deleted attribute,
    // insert the new attribute at the specified index, if specified.
    // Note: 0 is false in JavaScript
    // When index and the number of attribute definitions are the same,
    // the position of the deleted definition is the last. Add to the end of the attribute definition.
    if (index !== null && this.#definedTypes.size !== index) {
      this.#definedTypes = new Map(
        Array.from(this.#definedTypes.entries()).reduce(
          (acc, [key, val], i) => {
            if (i === index) {
              acc.push([
                attrDef.pred,
                createAttributeDefinition(valueType, attrDef)
              ])
            }
            acc.push([key, val])

            return acc
          },
          []
        )
      )
    } else {
      this.#definedTypes.set(
        attrDef.pred,
        createAttributeDefinition(valueType, attrDef)
      )
    }

    this.#eventEmitter.emit(
      `textae-event.type-definition.attribute.create`,
      attrDef.pred
    )
  }

  get(pred) {
    return this.#definedTypes.get(pred)
  }

  update(oldPred, attrDef) {
    // Predicate as key of map may be changed.
    // Keep order of attributes.
    // So that re-create an map instance.
    this.#definedTypes = new Map(
      Array.from(this.#definedTypes.entries()).map(([key, val]) => {
        if (key === oldPred) {
          return [
            attrDef.pred,
            createAttributeDefinition(val.valueType, attrDef)
          ]
        } else {
          return [key, val]
        }
      })
    )

    this.#eventEmitter.emit(
      `textae-event.type-definition.attribute.change`,
      attrDef.pred
    )

    return this.get(attrDef.pred)
  }

  updateValues(pred, values) {
    const hash = this.get(pred).externalFormat
    return this.update(pred, { ...hash, ...{ values } })
  }

  move(oldIndex, newIndex) {
    this.#definedTypes = new Map(
      arrayMoveImmutable(this.attributes, oldIndex, newIndex).map((a) => [
        a.pred,
        a
      ])
    )

    // -1 points to the end of the array.
    const { pred } =
      this.attributes[newIndex === -1 ? this.attributes.length - 1 : newIndex]

    // When an attribute definition move is done,
    // it fires an event to notify the palette to immediately reflect the display content.
    this.#eventEmitter.emit(`textae-event.type-definition.attribute.move`, pred)
  }

  delete(pred) {
    this.#definedTypes.delete(pred)
    this.#eventEmitter.emit(`textae-event.type-definition.attribute.delete`)
  }

  get attributes() {
    return Array.from(this.#definedTypes.values()) || []
  }

  isSelectionAttributeValueIndelible(pred, id) {
    if (this.get(pred).hasOnlyOneValue) {
      return true
    }

    // If there is an instance that uses a selection attribute, do not delete it.
    if (this.#getAllInstanceFunc().some((a) => a.equalsTo(pred, id))) {
      return true
    }

    return false
  }

  getLabel(pred, obj) {
    console.assert(
      this.#definedTypes.has(pred),
      `There is no attribute definition for ${pred}.`
    )

    return this.get(pred).getLabel(obj)
  }

  getDisplayName(pred, obj) {
    console.assert(
      this.#definedTypes.has(pred),
      `There is no attribute definition for ${pred}.`
    )

    return this.get(pred).getDisplayName(obj)
  }

  getColor(pred, obj) {
    if (this.#definedTypes.has(pred)) {
      return this.get(pred).getColor(obj)
    }
  }

  getIndexOf(pred) {
    return Array.from(this.#definedTypes.values()).findIndex(
      (a) => a.pred === pred
    )
  }

  getAttributeAt(number) {
    return Array.from(this.#definedTypes.values())[number - 1]
  }

  attributeCompareFunction(a, b) {
    // Order by attribute definition order.
    const indexOfA = this.getIndexOf(a.pred)
    const indexOfB = this.getIndexOf(b.pred)
    if (indexOfA !== indexOfB) {
      return indexOfA - indexOfB
    }

    if (a.id && b.id) {
      return a.id.localeCompare(b.id)
    }

    return 0
  }
}

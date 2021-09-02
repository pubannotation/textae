export default class TypeValues {
  constructor(typeName, attributes = []) {
    this._typeName = typeName
    this._attributes = attributes
  }

  get typeName() {
    return this._typeName
  }

  get attributes() {
    return this._attributes
  }

  isSameType(typeName, attributes = null) {
    if (attributes) {
      return this.typeName === typeName && this._hasSameAttributes(attributes)
    }

    return this.typeName === typeName
  }

  hasSpecificPredicateAttribute(pred) {
    return this.attributes.some((a) => a.pred === pred)
  }

  _hasSameAttributes(newAttributes) {
    if (newAttributes.length != this.attributes.length) {
      return false
    }

    const clone = [...newAttributes]
    for (const attribute of this.attributes) {
      const index = clone.findIndex(
        (a) => a.pred === attribute.pred && a.obj === String(attribute.obj)
      )
      if (index === -1) {
        return false
      }
      clone.splice(index, 1)
    }

    if (clone.length === 0) {
      return true
    }
  }
}

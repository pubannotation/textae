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

  _hasSameAttributes(newAttributes) {
    if (newAttributes.length != this.attributes.length) {
      return false
    }

    return (
      newAttributes.filter((a) =>
        this.attributes.some((b) => b.equalsTo(a.pred, a.obj))
      ).length == this.attributes.length
    )
  }
}

export default class TypeValues {
  #typeName
  #attributes

  constructor(typeName, attributes = []) {
    this.#typeName = typeName
    this.#attributes = attributes
  }

  get typeName() {
    return this.#typeName
  }

  get attributes() {
    return this.#attributes
  }

  // This property is used to copy to the system clipboard.
  get externalFormat() {
    return {
      obj: this.#typeName,
      attributes: this.#attributes.map(({ externalFormat }) => externalFormat)
    }
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
    if (newAttributes.length !== this.attributes.length) {
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

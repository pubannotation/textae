import TypeModel from '../SpanContainer/TypeModel'

export default class {
  constructor(attributeContainer, relationContaier, span, type, id = null) {
    this._span = span
    this._typeName = type
    this._id = id
    this._attributeContainer = attributeContainer
    this._relationContaier = relationContaier
  }

  get id() {
    return this._id
  }

  set id(val) {
    this._id = val
  }

  get span() {
    return this._span
  }

  set span(val) {
    this._span = val
  }

  get type() {
    // Replace null to 'null' if type is null and undefined too.
    return new TypeModel(String(this._typeName), this)
  }

  set type(val) {
    this._typeName = val
  }

  sameType(type, attributes) {
    return this.type.name === type && this._hasSameAttributes(attributes, type)
  }

  _hasSameAttributes(newAttributes) {
    if (newAttributes.length != this.attributes.length) {
      return false
    }

    return (
      newAttributes.filter((a) =>
        this.attributes.includes((a) => a.pred === a.pred && a.obj === a.obj)
      ).length == this.attributes.length
    )
  }

  get attributes() {
    return this._attributeContainer.all.filter((a) => a.subj === this._id)
  }

  getDifferentAttributes(newAttributes) {
    return this.attributes.filter(
      (oldA) =>
        !newAttributes.some(
          (newA) => oldA.pred === newA.pred && oldA.obj === newA.obj
        )
    )
  }

  get relations() {
    return this._relationContaier.all
      .filter((r) => r.obj === this.id || r.subj === this.id)
      .map((r) => r.id)
  }
}

import TypeModel from '../../../TypeModel'
import idFactory from '../../../idFactory'

export default class {
  constructor(
    editor,
    attributeContainer,
    relationContaier,
    definedTypes,
    span,
    type,
    id = null
  ) {
    this._editor = editor
    this._span = span
    this.typeName = type
    this._id = id
    this._attributeContainer = attributeContainer
    this._relationContaier = relationContaier
    this._definedTypes = definedTypes
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
    return new TypeModel(this._typeName, this, this._editor)
  }

  get typeName() {
    return this._typeName
  }

  set typeName(val) {
    // Replace null to 'null' if type is null and undefined too.
    this._typeName = String(val)
  }

  sameType(type, attributes) {
    return this.typeName === type && this._hasSameAttributes(attributes, type)
  }

  _hasSameAttributes(newAttributes) {
    if (newAttributes.length != this.attributes.length) {
      return false
    }

    return (
      newAttributes.filter((a) =>
        this.attributes.some(
          (b) => a.pred === b.pred && a.obj === String(b.obj)
        )
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

  toDomInfo(namespace, typeContainer) {
    const domInfo = this.type.toDomInfo(namespace, typeContainer)
    return Object.assign(domInfo, {
      entityId: idFactory.makeEntityDomId(this._editor, this.id),
      entityTitle: this.id
    })
  }
}

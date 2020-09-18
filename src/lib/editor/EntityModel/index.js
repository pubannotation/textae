import TypeValues from '../TypeValues'
import idFactory from '../idFactory'
import mergeTypesOf from './mergeTypesOf'

export default class {
  constructor(
    editor,
    attributeContainer,
    relationContaier,
    definedTypes,
    span,
    typeName,
    id = null
  ) {
    this._editor = editor
    this._span = span
    this.typeName = typeName
    this._id = id
    this._attributeContainer = attributeContainer
    this._relationContaier = relationContaier
    this._definedTypes = definedTypes
  }

  static mergedTypesOf(entities) {
    return mergeTypesOf(entities)
  }

  static rejectSameType(entities, typeName, attributes) {
    return entities.filter((e) => !e._isSameType(typeName, attributes))
  }

  static filterWithSamePredicateAttribute(entities, pred) {
    return entities.filter((e) => e._hasSpecificPredicateAttribute(pred))
  }

  // An entity cannot have more than one attribute with the same predicate.
  static filterWithoutSamePredicateAttribute(entities, pred) {
    return entities.filter((e) => !e._hasSpecificPredicateAttribute(pred))
  }

  get id() {
    return this._id
  }

  set id(val) {
    this._id = val
  }

  get span() {
    return this._span.id
  }

  set span(val) {
    this._span = val
  }

  get typeName() {
    return this._typeName
  }

  set typeName(val) {
    // Replace null to 'null' if type is null and undefined too.
    this._typeName = String(val)
  }

  get entityDomId() {
    return idFactory.makeEntityDomId(this._editor, this.id)
  }

  get typeValues() {
    return new TypeValues(this._typeName, this.attributes)
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
    return Object.assign(
      {
        id: this.entityDomId,
        entityId: idFactory.makeEntityDomId(this._editor, this.id),
        entityTitle: this.id
      },
      this.typeValues.toDomInfo(namespace, typeContainer)
    )
  }

  _isSameType(typeName, attributes) {
    return this.typeName === typeName && this._hasSameAttributes(attributes)
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

  _hasSpecificPredicateAttribute(pred) {
    return this.attributes.some((a) => a.pred === pred)
  }
}

import makeTypeId from './makeTypeId'

export default class {
  constructor(name, definedTypes, entity) {
    this._name = name
    this._definedTypes = definedTypes
    this._entity = entity
  }

  get name() {
    return this._name
  }

  get id() {
    return makeTypeId(this._entity)
  }

  get attributes() {
    return this._entity ? this._entity.attributes : []
  }

  hasAttributeWithOtherPredicate(pred) {
    return this.attributes.every((attr) => attr.pred !== pred)
  }

  get isBlock() {
    return this._definedTypes && this._definedTypes.isBlock(this._name)
  }

  // When you select multiple entities and display the edit dialog,
  // this is used to display the merged type name and attributes.
  mergeType(typeSummary) {
    typeSummary.name = this._name

    for (const attribute of this.attributes) {
      if (!typeSummary.attributes.some((a) => a.pred === attribute.pred)) {
        typeSummary.attributes.push(attribute)
      }
    }
    return typeSummary
  }
}

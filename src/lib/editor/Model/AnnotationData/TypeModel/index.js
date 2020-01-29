import makeTypeId from './makeTypeId'
import getLabel from '../../../getLabel'
import getUri from '../../../getUri'

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

  withoutSamePredicateAttribute(pred) {
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

  toDomInfo(namespace, typeContainer) {
    const id = this.id
    const value = this.name
    const label = getLabel(namespace, value, typeContainer.getLabel(value))
    const href = getUri(namespace, value, typeContainer.getUri(value))
    const color = typeContainer.getColor(value)
    const attributes = this._toAttributesForDom(typeContainer)

    return { id, label, href, color, attributes }
  }

  _toAttributesForDom(typeContainer) {
    return this.attributes.map((attribute) => {
      return Object.assign({}, attribute, {
        domId: `${this.id}-${attribute.id}`,
        title: `pred: ${attribute.pred}, value: ${attribute.obj}`,
        label: typeContainer.getAttributeLabel(attribute),
        color: typeContainer.getAttributeColor(attribute)
      })
    })
  }
}

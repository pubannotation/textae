import getLabel from './getLabel'
import getUri from './getUri'

export default class {
  constructor(name, entity, editor) {
    this._name = name
    this._entity = entity
    this._editor = editor
  }

  get name() {
    return this._name
  }

  get id() {
    return `${this._editor.editorId}-T${this._entity.id.replace(/[:¥.]/g, '')}`
  }

  get attributes() {
    return this._entity ? this._entity.attributes : []
  }

  withSamePredicateAttribute(pred) {
    return this.attributes.some((attr) => attr.pred === pred)
  }

  withoutSamePredicateAttribute(pred) {
    return this.attributes.every((attr) => attr.pred !== pred)
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
    const attributes = this._toAttributesForDom(namespace, typeContainer)

    return { id, label, href, color, attributes }
  }

  _toAttributesForDom(namespace, typeContainer) {
    return this.attributes.map((attribute) => {
      return Object.assign({}, attribute, {
        title: `pred: ${attribute.pred}, value: ${attribute.obj}`,
        label: getLabel(
          namespace,
          typeof attribute.obj === 'string' ? attribute.obj : '',
          typeContainer.getAttributeLabel(attribute)
        ),
        href: getUri(
          namespace,
          typeof attribute.obj === 'string' ? attribute.obj : ''
        ),
        color: typeContainer.getAttributeColor(attribute)
      })
    })
  }
}

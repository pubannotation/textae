import getLabel from './getLabel'
import getUri from './getUri'

export default class {
  constructor(name, entity) {
    this._name = name
    this._entity = entity
  }

  get name() {
    return this._name
  }

  get attributes() {
    return this._entity ? this._entity.attributes : []
  }

  toDomInfo(namespace, typeContainer) {
    const value = this.name
    const label = getLabel(namespace, value, typeContainer.getLabel(value))
    const href = getUri(namespace, value, typeContainer.getUri(value))
    const color = typeContainer.getColor(value)
    const attributes = this._toAttributesForDom(namespace, typeContainer)

    return { label, href, color, attributes }
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

import getLabel from './getLabel'
import getUri from './getUri'

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

  toHTMLElementContext(namespace, typeContainer) {
    return {
      label: this._label(namespace, typeContainer),
      href: this._href(namespace, typeContainer),
      color: typeContainer.getColor(this.typeName),
      attributes: this._attributesInHTMLElementContext(namespace, typeContainer)
    }
  }

  _label(namespace, typeContainer) {
    return getLabel(
      namespace,
      this.typeName,
      typeContainer.getLabel(this.typeName)
    )
  }

  _href(namespace, typeContainer) {
    return getUri(namespace, this.typeName, typeContainer.getUri(this.typeName))
  }

  _attributesInHTMLElementContext(namespace, typeContainer) {
    return this.attributes.map(({ pred, obj }) => ({
      pred,
      obj,
      title: `pred: ${pred}, value: ${obj}`,
      label: getLabel(
        namespace,
        typeof obj === 'string' ? obj : '',
        typeContainer.attributeContainer.getLabel(pred, obj)
      ),
      href: getUri(namespace, typeof obj === 'string' ? obj : ''),
      color: typeContainer.attributeContainer.getColor(pred, obj)
    }))
  }
}

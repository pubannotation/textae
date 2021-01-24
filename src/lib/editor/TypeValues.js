import getDisplayName from './getDisplayName'
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

  toHTMLElementContext(namespace, typeContainer, attributeContainer) {
    return {
      label: this._label(namespace, typeContainer),
      href: this._href(namespace, typeContainer),
      color: typeContainer.getColor(this.typeName),
      attributes: this._attributesInHTMLElementContext(
        namespace,
        attributeContainer
      )
    }
  }

  _label(namespace, typeContainer) {
    return getDisplayName(
      namespace,
      this.typeName,
      typeContainer.getLabel(this.typeName)
    )
  }

  _href(namespace, typeContainer) {
    return getUri(namespace, this.typeName, typeContainer.getUri(this.typeName))
  }

  _attributesInHTMLElementContext(namespace, attributeContainer) {
    return this.attributes.map(({ pred, obj }) => ({
      pred,
      obj,
      title: `pred: ${pred}, value: ${obj}`,
      label: getDisplayName(
        namespace,
        typeof obj === 'string' ? obj : '',
        attributeContainer.getDisplayName(pred, obj)
      ),
      href: getUri(namespace, typeof obj === 'string' ? obj : ''),
      color: attributeContainer.getColor(pred, obj)
    }))
  }
}

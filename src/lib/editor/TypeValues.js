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

  toHtmlelementInfo(namespace, typeContainer) {
    return {
      label: this._label(namespace, typeContainer),
      href: this._href(namespace, typeContainer),
      color: typeContainer.getColor(this.typeName),
      attributes: this._attributesForHtmlelementInfo(namespace, typeContainer)
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

  _attributesForHtmlelementInfo(namespace, typeContainer) {
    return this.attributes.map((attr) => ({
      pred: attr.pred,
      obj: attr.obj,
      title: `pred: ${attr.pred}, value: ${attr.obj}`,
      label: getLabel(
        namespace,
        typeof attr.obj === 'string' ? attr.obj : '',
        typeContainer.getAttributeLabel(attr)
      ),
      href: getUri(namespace, typeof attr.obj === 'string' ? attr.obj : ''),
      color: typeContainer.getAttributeColor(attr)
    }))
  }
}

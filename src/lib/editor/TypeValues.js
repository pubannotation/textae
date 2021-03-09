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

  toHTMLElementContext(
    namespace,
    definitionContainer,
    attributeDefinitionContainer
  ) {
    return {
      displayName: this._getDisplayName(namespace, definitionContainer),
      href: this._href(namespace, definitionContainer),
      color: definitionContainer.getColor(this.typeName),
      attributes: this._attributesInHTMLElementContext(
        namespace,
        attributeDefinitionContainer
      )
    }
  }

  _getDisplayName(namespace, definitionContainer) {
    return getDisplayName(
      namespace,
      this.typeName,
      definitionContainer.getLabel(this.typeName)
    )
  }

  _href(namespace, definitionContainer) {
    return getUri(
      namespace,
      this.typeName,
      definitionContainer.getUri(this.typeName)
    )
  }

  _attributesInHTMLElementContext(namespace, attributeDefinitionContainer) {
    return this.attributes.map(({ pred, obj }) => ({
      pred,
      obj,
      title: `pred: ${pred}, value: ${obj}`,
      displayName: getDisplayName(
        namespace,
        typeof obj === 'string' ? obj : '',
        attributeDefinitionContainer.getDisplayName(pred, obj)
      ),
      href: getUri(namespace, typeof obj === 'string' ? obj : ''),
      color: attributeDefinitionContainer.getColor(pred, obj)
    }))
  }
}

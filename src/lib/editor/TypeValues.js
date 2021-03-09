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
      displayName: getDisplayName(
        namespace,
        this.typeName,
        definitionContainer.getLabel(this.typeName)
      ),
      href: getUri(
        namespace,
        this.typeName,
        definitionContainer.getUri(this.typeName)
      ),
      color: definitionContainer.getColor(this.typeName),
      attributes: this.attributes.map(
        ({ pred, obj, displayName, href, color }) => ({
          pred,
          obj,
          title: `pred: ${pred}, value: ${obj}`,
          displayName,
          href,
          color
        })
      )
    }
  }
}

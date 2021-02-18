export default class DefaultHandler {
  constructor(annotationType, definitionContainer, commander) {
    this._annotationType = annotationType
    this._definitionContainer = definitionContainer
    this._commander = commander
  }

  addType(newType) {
    console.assert(newType.id, 'id is necessary!')
    return this._commander.factory.createTypeDefinitionCommand(
      this._definitionContainer,
      newType
    )
  }

  changeType(id, changedProperties) {
    return this._commander.factory.changeTypeDefinitionCommand(
      this._definitionContainer,
      this._annotationType,
      id,
      changedProperties
    )
  }

  jsPlumbConnectionClicked(jsPlumbConnection) {
    // Open link when view mode because link in label of jsPlumb event is not fired.
    const { link } = jsPlumbConnection
    if (link) {
      const href = link.getAttribute('href')
      window.open(href, '_blank')
    }
  }

  removeType(id, label) {
    const removeType = {
      id,
      label: label || ''
    }

    if (typeof id === 'undefined') {
      throw new Error('You must set the type id to remove.')
    }

    return this._commander.factory.removeTypeDefinitionCommand(
      this._definitionContainer,
      removeType
    )
  }

  // Dummy funtion for shotcut key 'w' in the ViewMode.
  changeLabelHandler() {}

  // Dummy funtion for shotcut key '1' ~ 9 in the ViewMode and RelationMode.
  manipulateAttribute() {}
}

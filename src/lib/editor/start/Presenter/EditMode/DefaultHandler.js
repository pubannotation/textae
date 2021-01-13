export default class DefaultHandler {
  constructor(configType, annotationType, typeContainer, commander) {
    this._configType = configType
    this._annotationType = annotationType
    this._typeContainer = typeContainer
    this._commander = commander
  }

  addType(newType) {
    console.assert(newType.id, 'id is necessary!')
    return this._commander.factory.createTypeDefinitionCommand(
      this._configType,
      newType
    )
  }

  changeType(id, changedProperties) {
    return this._commander.factory.changeTypeDefinitionCommand(
      this._typeContainer,
      this._annotationType,
      id,
      changedProperties
    )
  }

  jsPlumbConnectionClicked(jsPlumbConnection) {
    // Open link when view mode because link in label of jsPlumb event is not fired.
    const link = jsPlumbConnection.link
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
      this._configType,
      removeType
    )
  }

  // Dummy funtion for shotcut key 'w' in the ViewMode.
  changeLabelHandler() {}

  // Dummy funtion for shotcut key '1' ~ 9 in the ViewMode and RelationMode.
  manipulateAttribute() {}
}

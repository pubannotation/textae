export default class DefaultHandler {
  constructor(
    annotationType,
    definitionContainer,
    commander,
    selectionModel,
    annotationData
  ) {
    this._annotationType = annotationType
    this._definitionContainer = definitionContainer
    this._commander = commander
    this._selectionModel = selectionModel
    this._annotationData = annotationData
  }

  changeTypeDefinition(id, changedProperties) {
    return this._commander.factory.changeTypeDefinitionCommand(
      this._definitionContainer,
      this._annotationType,
      id,
      changedProperties
    )
  }

  removeTypeDefinition(id, label) {
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
}

import LABEL from '../../../LABEL'

export default class {
  constructor(modelType, typeContainer, commander) {
    this._modelType = modelType
    this.typeContainer = typeContainer
    this.commander = commander
  }

  addType(newType) {
    console.assert(newType.id, 'id is necessary!')
    return this.commander.factory.createTypeDefinitionCommand(
      this._modelType,
      newType
    )
  }

  changeType(id, changedProperties) {
    return this.commander.factory.changeTypeDefinitionCommand(
      this._modelType,
      id,
      changedProperties
    )
  }

  jsPlumbConnectionClicked(...args) {
    // Open link when view mode because link in label of jsPlumb event is not fired.
    const link = args[0].getOverlay(LABEL.id).canvas.querySelector('a')
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

    return this.commander.factory.removeTypeDefinitionCommand(
      this._modelType,
      removeType
    )
  }

  // Dummy funtion for shotcut key 'w' in the ViewMode.
  changeLabelHandler() {}

  // Dummy funtion for shotcut key '1' ~ 9 in the ViewMode and RelationMode.
  manipulateAttribute() {}
}

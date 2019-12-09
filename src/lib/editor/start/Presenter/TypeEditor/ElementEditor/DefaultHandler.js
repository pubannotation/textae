import LABEL from '../../../LABEL'

export default class {
  constructor(modelType, selectionModel, typeContainer, commander) {
    this.selectionModel = selectionModel
    this.modelType = modelType
    this.typeContainer = typeContainer
    this.commander = commander
  }

  getSelectedIdEditable() {
    if (this.selectionModel) {
      return this.selectionModel.all
    }

    return []
  }

  addType(newType) {
    console.assert(newType.id, 'id is necessary!')
    return this.commander.factory.typeDefinitionCreateCommand(
      this.typeContainer,
      newType
    )
  }

  changeType(id, changedProperties) {
    return this.commander.factory.typeDefinitionChangeCommand(
      this.typeContainer,
      this.modelType,
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

  selectAll(typeName) {
    this.selectionModel.clear()
    this.annotationData.all.map((model) => {
      if (model.type.name === typeName) {
        this.selectionModel.add(model.id)
      }
    })
  }

  removeType(id, label) {
    const removeType = {
      id,
      label: label || ''
    }

    if (typeof id === 'undefined') {
      throw new Error('You must set the type id to remove.')
    }

    return this.commander.factory.typeDefinitionRemoveCommand(
      this.typeContainer,
      removeType
    )
  }
}

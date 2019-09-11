export default class {
  constructor(modelType, selectionModel, typeContainer, commander) {
    this.selectionModel = selectionModel
    this.modelType = modelType
    this.typeContainer = typeContainer
    this.commander = commander
  }

  getSelectedIdEditable() {
    if (this.selectionModel) {
      return this.selectionModel.all()
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

  getSelectedType() {
    const id = this.selectionModel.single()

    if (id) {
      return this.annotationData.get(id).type
    }

    return ''
  }

  jsPlumbConnectionClicked() {
    // A Swithing point to change a behavior when relation is clicked.
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

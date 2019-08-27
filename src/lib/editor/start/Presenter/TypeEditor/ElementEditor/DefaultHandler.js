export default class {
  constructor(modelType, selectionModel, typeContainer, command) {
    this.selectionModel = selectionModel
    this.modelType = modelType
    this.typeContainer = typeContainer
    this.command = command
  }

  getSelectedIdEditable() {
    if (this.selectionModel) {
      return this.selectionModel.all()
    }

    return []
  }

  addType(newType) {
    console.assert(newType.id, 'id is necessary!')
    return this.command.factory.typeDefinitionCreateCommand(
      this.typeContainer,
      newType
    )
  }

  changeType(id, changedProperties) {
    return this.command.factory.typeDefinitionChangeCommand(
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

  selectAllByLabel(label) {
    this.selectionModel.clear()
    this.annotationData.all.map((model) => {
      if (model.type === label) {
        this.selectionModel.add(model.id)
      }
    })
  }

  selectAllById(ids) {
    this.selectionModel.clear()
    this.annotationData.all.map((model) => {
      ids.map((id) => {
        if (model.id === id) {
          this.selectionModel.add(model.id)
        }
      })
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

    return this.command.factory.typeDefinitionRemoveCommand(
      this.typeContainer,
      removeType
    )
  }
}

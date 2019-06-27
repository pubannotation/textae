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
    return this.command.factory.typeCreateCommand(this.typeContainer, newType)
  }

  changeType(id, newType) {
    return this.command.factory.typeChangeCommand(this.typeContainer, this.modelType, id, newType)
  }

  changeLabelOfId(id, label) {
    const oldType = this.typeContainer.getDefinedType(id)

    if (!oldType.id) {
      return this.command.factory.typeCreateCommand(this.typeContainer, {id: id, label: label})
    } else if (oldType.label !== label) {
      return this.command.factory.typeChangeCommand(this.typeContainer, id, label)
    }
  }

  getSelectedType() {
    let id = this.selectionModel.single()

    if (id) {
      return this.annotationData.get(id).type
    }

    return ''
  }

  jsPlumbConnectionClicked() {
    // A Swithing point to change a behavior when relation is clicked.
  }

  getEditTarget(newType) {
    return this.selectionModel.all()
      .filter((id) => this.annotationData.get(id).type !== newType)
  }

  selectAllByLabel(label) {
    this.selectionModel.clear()
    this.annotationData.all().map((model) => {
      if (model.type === label) {
        this.selectionModel.add(model.id)
      }
    })
  }

  selectAllById(ids) {
    this.selectionModel.clear()
    this.annotationData.all().map((model) => {
      ids.map((id) => {
        if (model.id === id) {
          this.selectionModel.add(model.id)
        }
      })
    })
  }

  removeType(id, label) {
    let removeType = {
      id: id,
      label: label || ''
    }

    if (typeof id === "undefined") {
      throw new Error('You must set the type id to remove.')
    }

    return [this.command.factory.typeRemoveCommand(this.typeContainer, removeType)]
  }
}

export default class {
  constructor() {
    // The Reference to content to be shown in the pallet.
    this.typeContainer = null
  }
  addType(id) {
    return this.command.factory.typeCreateCommand(this.typeContainer, {id: id})
  }
  changeLabelOfId(id, label) {
    const oldType = this.typeContainer.getDefinedType(id)

    if (!oldType.id) {
      return this.command.factory.typeCreateCommand(this.typeContainer, {id: id, label: label})
    }

    if (oldType.id && oldType.label !== label) {
      return this.command.factory.typeChangeLabelCommand(this.typeContainer, id, label)
    }
  }
  changeTypeOfSelectedElement() {}
  changeColorOfType() {}
  getSelectedIdEditable() {
    if (this.selectionModel) {
      return this.selectionModel.all()
    }

    return []
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
}

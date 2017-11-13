export default class {
  constructor() {
    // The Reference to content to be shown in the pallet.
    this.typeContainer = null
  }
  changeLabelOfId(id, label) {
    const oldType = this.typeContainer.getDefinedType(id)

    if (!oldType.id) {
      return this.command.factory.typeCreateCommand(this.typeContainer, id, label)
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
  selectAll() {}
}

import DefaultHandler from '../DefaultHandler'

export default class extends DefaultHandler {
  constructor(typeContainer, command, annotationData, selectionModel) {
    super()
    this.typeContainer = typeContainer.relation
    this.command = command
    this.annotationData = annotationData.relation
    this.selectionModel = selectionModel.relation
    this.clearAllSelection = () => selectionModel.clear()
  }
  changeTypeOfSelectedElement(newType) {
    return this.getEditTarget(newType)
      .map((id) => this.command.factory.relationChangeTypeCommand(id, newType))
  }
  jsPlumbConnectionClicked(jsPlumbConnection, event) {
    // Select or deselect relation.
    // This function is expected to be called when Relation-Edit-Mode.
    let relationId = jsPlumbConnection.getParameter("id")

    if (event.ctrlKey || event.metaKey) {
      this.selectionModel.toggle(relationId)
    } else if (this.selectionModel.single() !== relationId) {
      // Select only self
      this.clearAllSelection()
      this.selectionModel.add(relationId)
    }
  }
  changeColorOfType(id, newColor) {
    return [this.command.factory.typeChangeColorCommand(this.typeContainer, id, newColor)]
  }
  selectAll(id) {
    this.selectionModel.clear()
    this.annotationData.all().map((relation) => {
      if (relation.type === id) {
        this.selectionModel.add(relation.id)
      }
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

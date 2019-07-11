import DefaultHandler from '../DefaultHandler'

export default class extends DefaultHandler {
  constructor(typeDefinition, command, annotationData, selectionModel) {
    super('relation', selectionModel, typeDefinition.relation, command)

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
}

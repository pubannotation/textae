import DefaultHandler from '../DefaultHandler'
import EditLabelDialog from '../../../../../../component/EditLabelDialog'

export default class extends DefaultHandler {
  constructor(typeDefinition, commander, annotationData, selectionModel) {
    super('relation', typeDefinition.relation, commander)

    this._annotationData = annotationData
    this._selectionModel = selectionModel
  }

  changeTypeOfSelectedElement(newType) {
    return this.commander.factory.changeTypeOfSelectedRelationsCommand(newType)
  }

  changeLabelHandler(autocompletionWs) {
    if (this._selectionModel.relation.some) {
      const type = this._getSelectedType()
      const dialog = new EditLabelDialog(
        type,
        this.typeContainer,
        autocompletionWs
      )
      dialog.promise.then(({ value, label }) => {
        const commands = this.commander.factory.changeRelationLabelCommand(
          label,
          value,
          this.typeContainer
        )

        if (value) {
          this.commander.invoke(commands)
        }
      })
      dialog.open()
    }
  }

  jsPlumbConnectionClicked(jsPlumbConnection, event) {
    // Select or deselect relation.
    // This function is expected to be called when Relation-Edit-Mode.
    const relationId = jsPlumbConnection.getParameter('id')

    if (event.ctrlKey || event.metaKey) {
      this._selectionModel.relation.toggle(relationId)
    } else if (this._selectionModel.relation.single() !== relationId) {
      // Select only self
      this._selectionModel.relation.clear()
      this._selectionModel.relation.add(relationId)
    }
  }

  _getSelectedType() {
    const id = this._selectionModel.relation.single()

    if (id) {
      return this._annotationData.relation.get(id).type
    }

    return ''
  }

  get selectedIds() {
    return this._selectionModel.relation.all.map((relation) => relation.id)
  }

  selectAll(typeName) {
    this._selectionModel.relation.clear()
    for (const { id } of this._annotationData.relation.findByType(typeName)) {
      this._selectionModel.relation.add(id)
    }
  }
}

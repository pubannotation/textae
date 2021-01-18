import DefaultHandler from '../DefaultHandler'
import EditRelationDialog from '../../../../../component/EditRelationDialog'

export default class EditHandler extends DefaultHandler {
  constructor(typeContainer, commander, annotationData, selectionModel) {
    super('relation', typeContainer, commander)

    this._annotationData = annotationData
    this._selectionModel = selectionModel
  }

  changeTypeOfSelectedElement(newType) {
    return this._commander.factory.changeTypeOfSelectedRelationsCommand(newType)
  }

  changeLabelHandler(autocompletionWs) {
    if (this._selectionModel.relation.some) {
      const done = ({ value, label }) => {
        const commands = this._commander.factory.changeEntityTypeCommand(
          label,
          value,
          this._typeContainer,
          []
        )

        if (value) {
          this._commander.invoke(commands)
        }
      }

      const type = this._getSelectedType()
      const dialog = new EditRelationDialog(
        type,
        this._typeContainer,
        autocompletionWs
      )
      dialog.promise.then(done)
      dialog.open()
    }
  }

  jsPlumbConnectionClicked(jsPlumbConnection, event) {
    // Select or deselect relation.
    // This function is expected to be called when Relation-Edit-Mode.
    const relationId = jsPlumbConnection.relationId

    if (event.ctrlKey || event.metaKey) {
      this._selectionModel.relation.add(relationId)
    } else {
      this._selectionModel.selectRelation(relationId)
    }
  }

  _getSelectedType() {
    const relation = this._selectionModel.relation.single

    if (relation) {
      return relation.typeName
    }

    return ''
  }

  selectAll(typeName) {
    this._selectionModel.relation.clear()
    for (const { id } of this._annotationData.relation.findByType(typeName)) {
      this._selectionModel.relation.add(id)
    }
  }
}

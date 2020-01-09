import DefaultHandler from '../DefaultHandler'
import EditLabelDialog from '../../../../../../component/EditLabelDialog'

export default class extends DefaultHandler {
  constructor(typeDefinition, command, annotationData, selectionModel) {
    super('relation', selectionModel, typeDefinition.relation, command)

    this.annotationData = annotationData.relation
    this.selectionModel = selectionModel.relation
    this.clearAllSelection = () => selectionModel.clear()
  }

  changeTypeOfSelectedElement(newType) {
    return this.commander.factory.changeTypeOfSelectedRelationsCommand(newType)
  }

  changeLabelHandler(autocompletionWs) {
    if (this.getSelectedIdEditable().length > 0) {
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
      this.selectionModel.toggle(relationId)
    } else if (this.selectionModel.single() !== relationId) {
      // Select only self
      this.clearAllSelection()
      this.selectionModel.add(relationId)
    }
  }

  _getSelectedType() {
    const id = this.selectionModel.single()

    if (id) {
      return this.annotationData.get(id).type
    }

    return ''
  }
}

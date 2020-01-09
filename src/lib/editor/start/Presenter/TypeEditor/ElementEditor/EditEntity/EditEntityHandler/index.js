import DefaultHandler from '../../DefaultHandler'
import EditTypeDialog from '../../../../../../../component/EditTypeDialog'
import mergeTypes from './mergeTypes'

export default class extends DefaultHandler {
  constructor(typeDefinition, commander, annotationData, selectionModel) {
    super('entity', selectionModel, typeDefinition.entity, commander)

    this.annotationData = annotationData.entity
    this.selectionModel = selectionModel.entity
  }

  jsPlumbConnectionClicked(_, event) {
    // Do not open link when term mode or simple mode.
    event.originalEvent.preventDefault()
  }

  changeTypeOfSelectedElement(newType) {
    return this.commander.factory.changeTypeRemoveRelationOfSelectedEntitiesCommand(
      newType
    )
  }

  changeLabelHandler(autocompletionWs) {
    if (this.getSelectedIdEditable().length > 0) {
      const type = mergeTypes(
        this.selectionModel.all.map((id) => this.annotationData.get(id).type)
      )
      const done = ({ typeName, label, attributes }) => {
        const commands = this.commander.factory.changeEntityTypeCommand(
          label,
          typeName,
          attributes,
          this.typeContainer
        )

        if (typeName) {
          this.commander.invoke(commands)
        }
      }

      const dialog = new EditTypeDialog(
        type,
        this.typeContainer,
        autocompletionWs
      )
      dialog.promise.then(done)
      dialog.open()
    }
  }
}

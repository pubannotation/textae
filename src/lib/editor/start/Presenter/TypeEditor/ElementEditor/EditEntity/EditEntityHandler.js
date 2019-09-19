import DefaultHandler from '../DefaultHandler'
import EditLabelDialog from '../../../../../../component/EditLabelDialog'

export default class extends DefaultHandler {
  constructor(typeDefinition, commander, annotationData, selectionModel) {
    super('entity', selectionModel, typeDefinition.entity, commander)

    this.annotationData = annotationData.entity
    this.selectionModel = selectionModel.entity
  }

  changeTypeOfSelectedElement(newType) {
    return this.commander.factory.changeTypeRemoveRelationOfSelectedEntitiesCommand(
      newType,
      this.typeContainer.isBlock(newType)
    )
  }

  changeLabelHandler(autocompletionWs) {
    if (this.getSelectedIdEditable().length > 0) {
      const predicate = 'type'
      const type = this.getSelectedType()
      const done = (_, value, label) => {
        const commands = this.commander.factory.changeEntityLabelCommand(
          label,
          value,
          this.typeContainer
        )

        if (value) {
          this.commander.invoke(commands)
        }
      }

      const dialog = new EditLabelDialog(
        predicate,
        type,
        done,
        this.typeContainer,
        autocompletionWs
      )
      dialog.open()
    }
  }
}

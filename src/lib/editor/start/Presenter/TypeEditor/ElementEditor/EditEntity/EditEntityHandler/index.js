import DefaultHandler from '../../DefaultHandler'
import EditTypeDialog from '../../../../../../../component/EditTypeDialog'
import mergeTypes from './mergeTypes'

export default class extends DefaultHandler {
  constructor(typeDefinition, commander, annotationData, selectionModel) {
    super('entity', typeDefinition.entity, commander)

    this._annotationData = annotationData
    this._selectionModel = selectionModel
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
    if (this._selectionModel.entity.some) {
      const type = mergeTypes(
        this._selectionModel.entity.all.map(
          (id) => this._annotationData.entity.get(id).type
        )
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

  get selectedIds() {
    return this._selectionModel.entity.all
  }

  selectAll(typeName) {
    this._selectionModel.entity.clear()
    for (const { id } of this._annotationData.entity.findByType(typeName)) {
      this._selectionModel.entity.add(id)
    }
  }
}

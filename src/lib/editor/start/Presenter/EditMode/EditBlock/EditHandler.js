import EditEntityDialog from '../../../../../component/EditEntityDialog'
import EntityModel from '../../../../EntityModel'
import DefaultHandler from '../DefaultHandler'

export default class extends DefaultHandler {
  constructor(
    editor,
    typeDefinition,
    commander,
    annotationData,
    selectionModel
  ) {
    super('block', 'entity', typeDefinition.block, commander)

    this._editor = editor
    this._selectionModel = selectionModel
    this._annotationData = annotationData
    this._typeDefinition = typeDefinition
  }

  jsPlumbConnectionClicked(_, event) {
    // Do not open link when term mode or simple mode.
    event.originalEvent.preventDefault()
  }

  changeTypeOfSelectedElement(newType) {
    return this._commander.factory.changeTypeOfSelectedEntitiesCommand(newType)
  }

  changeLabelHandler(autocompletionWs) {
    if (this._selectionModel.entity.some) {
      const done = ({ typeName, label, attributes }) => {
        const commands = this._commander.factory.changeEntityTypeCommand(
          label,
          typeName,
          attributes,
          this._typeContainer
        )

        if (typeName) {
          this._commander.invoke(commands)
        }
      }

      const dialog = new EditEntityDialog(
        this._editor,
        this._typeContainer,
        autocompletionWs,
        EntityModel.mergedTypesOf(this._selectionModel.entity.all)
      )
      dialog.promise.then(done)
      dialog.open()
    }
  }

  selectAll(typeName) {
    this._selectionModel.entity.clear()
    for (const { id } of this._annotationData.entity.findByType(typeName)) {
      this._selectionModel.entity.add(id)
    }
  }
}

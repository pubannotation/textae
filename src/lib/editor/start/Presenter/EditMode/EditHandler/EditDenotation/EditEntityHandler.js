import EditEntityDialog from '../../../../../../component/EditEntityDialog'
import EntityModel from '../../../../../EntityModel'
import DefaultHandler from '../DefaultHandler'

export default class extends DefaultHandler {
  constructor(
    editor,
    typeDefinition,
    commander,
    annotationData,
    selectionModel,
    editAttribute,
    deleteAttribute
  ) {
    super('denotation', 'entity', typeDefinition.denotation, commander)

    this._editor = editor
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._typeDefinition = typeDefinition
    this._editAttribute = editAttribute
    this._deleteAttribute = deleteAttribute
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

  manipulateAttribute(number, shiftKey) {
    if (shiftKey) {
      this._deleteAttribute.handle(this._typeDefinition, number)
    } else {
      this._editAttribute.handle(this._typeDefinition, number)
    }
  }

  selectAll(typeName) {
    this._selectionModel.entity.clear()
    for (const { id } of this._annotationData.entity.findByType(typeName)) {
      this._selectionModel.entity.add(id)
    }
  }
}

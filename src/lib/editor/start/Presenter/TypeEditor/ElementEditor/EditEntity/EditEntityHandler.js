import EditEntityTypeDialog from '../../../../../../component/EditEntityTypeDialog'
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
    super('entity', typeDefinition.entity, commander)

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
    return this.commander.factory.changeTypeOfSelectedEntitiesCommand(newType)
  }

  changeLabelHandler(autocompletionWs) {
    if (this._selectionModel.entity.some) {
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

      const dialog = new EditEntityTypeDialog(
        this._editor,
        this.typeContainer,
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

  get selectedIds() {
    return this._selectionModel.entity.all.map((entity) => entity.id)
  }

  selectAll(typeName) {
    this._selectionModel.entity.clear()
    for (const { id } of this._annotationData.entity.findByType(typeName)) {
      this._selectionModel.entity.add(id)
    }
  }
}

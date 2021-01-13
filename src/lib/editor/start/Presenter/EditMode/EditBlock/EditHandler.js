import EditEntityDialog from '../../../../../component/EditEntityDialog'
import EntityModel from '../../../../EntityModel'
import DefaultHandler from '../DefaultHandler'

export default class EditHandler extends DefaultHandler {
  constructor(
    editor,
    typeContainer,
    commander,
    annotationData,
    selectionModel,
    attributeEditor
  ) {
    super('entity', typeContainer, commander)

    this._editor = editor
    this._selectionModel = selectionModel
    this._annotationData = annotationData
    this._attributeEditor = attributeEditor
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
        this._annotationData.typeDefinition.attribute,
        autocompletionWs,
        EntityModel.mergedTypesOf(this._selectionModel.entity.all)
      )
      dialog.promise.then(done)
      dialog.open()
    }
  }

  manipulateAttribute(number, shiftKey) {
    if (shiftKey) {
      this._attributeEditor.deleteAt(number)
    } else {
      this._attributeEditor.addOrEditAt(number)
    }
  }

  selectAll(typeName) {
    this._selectionModel.entity.clear()
    for (const { id } of this._annotationData.entity.findByType(typeName)) {
      this._selectionModel.entity.add(id)
    }
  }
}

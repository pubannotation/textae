import EditEntityDialog from '../../../../../component/EditEntityDialog'
import mergedTypesOf from '../mergeTypesOf'
import DefaultHandler from '../DefaultHandler'

export default class EditHandler extends DefaultHandler {
  constructor(
    editor,
    definitionContainer,
    commander,
    annotationData,
    selectionModel,
    attributeEditor
  ) {
    super('entity', definitionContainer, commander)

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
        const commands = this._commander.factory.changeItemTypeCommand(
          label,
          typeName,
          this._definitionContainer,
          attributes
        )

        if (typeName) {
          this._commander.invoke(commands)
        }
      }

      new EditEntityDialog(
        this._editor,
        this._definitionContainer,
        this._annotationData.typeDefinition.attribute,
        autocompletionWs,
        mergedTypesOf(this._selectionModel.entity.all)
      )
        .open()
        .then(done)
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

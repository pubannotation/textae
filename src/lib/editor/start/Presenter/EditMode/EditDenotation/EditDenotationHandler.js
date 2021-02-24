import EditEntityDialog from '../../../../../component/EditEntityDialog'
import mergedTypesOf from '../mergeTypesOf'
import DefaultHandler from '../DefaultHandler'

export default class EditDenotationHandler extends DefaultHandler {
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
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._attributeEditor = attributeEditor
  }

  changeInstance(autocompletionWs) {
    if (this._selectionModel.entity.some) {
      new EditEntityDialog(
        this._editor,
        this._definitionContainer,
        this._annotationData.typeDefinition.attribute,
        autocompletionWs,
        mergedTypesOf(this._selectionModel.entity.all)
      )
        .open()
        .then((values) => this._labelChanged(values))
    }
  }

  relationClicked(event) {
    // Do not open link when term mode or simple mode.
    event.originalEvent.preventDefault()
  }

  manipulateAttribute(number, shiftKey) {
    if (shiftKey) {
      this._attributeEditor.deleteAt(number)
    } else {
      this._attributeEditor.addOrEditAt(number)
    }
  }
}

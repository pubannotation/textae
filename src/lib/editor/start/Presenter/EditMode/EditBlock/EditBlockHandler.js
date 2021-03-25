import EditEntityDialog from '../../../../../component/EditEntityDialog'
import mergedTypeValuesOf from '../mergedTypeValuesOf'
import DefaultHandler from '../DefaultHandler'

export default class EditBlockHandler extends DefaultHandler {
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

  changeInstance(autocompletionWs) {
    if (this._selectionModel.entity.some) {
      new EditEntityDialog(
        this._editor,
        this._definitionContainer,
        this._annotationData.typeDefinition.attribute,
        autocompletionWs,
        mergedTypeValuesOf(this._selectionModel.entity.all)
      )
        .open()
        .then((values) => this._labelChanged(values))
    }
  }

  manipulateAttribute(number, shiftKey) {
    if (shiftKey) {
      this._attributeEditor.deleteAt(number)
    } else {
      this._attributeEditor.addOrEditAt(number)
    }
  }
}

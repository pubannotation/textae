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
    super('entity', definitionContainer, commander, attributeEditor)

    this._editor = editor
    this._selectionModel = selectionModel
    this._annotationData = annotationData
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
}

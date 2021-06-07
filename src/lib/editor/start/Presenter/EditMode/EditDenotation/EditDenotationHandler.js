import EditTypeValuesDialog from '../../../../../component/EditTypeValuesDialog'
import mergedTypeValuesOf from '../mergedTypeValuesOf'
import DefaultHandler from '../DefaultHandler'

export default class EditDenotationHandler extends DefaultHandler {
  constructor(
    editor,
    definitionContainer,
    commander,
    annotationData,
    selectionModel,
    typeValuesPallet,
    getAutocompletionWs
  ) {
    super(
      editor,
      'entity',
      definitionContainer,
      commander,
      annotationData,
      selectionModel.entity,
      typeValuesPallet
    )

    this._editor = editor
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._getAutocompletionWs = getAutocompletionWs
  }

  editTypeValues() {
    if (this._selectionModel.entity.some) {
      new EditTypeValuesDialog(
        this._editor,
        this._definitionContainer,
        this._annotationData.typeDefinition.attribute,
        this._getAutocompletionWs(),
        mergedTypeValuesOf(this._selectionModel.entity.all)
      )
        .open()
        .then((values) => this._typeValuesChanged(values))
    }
  }
}

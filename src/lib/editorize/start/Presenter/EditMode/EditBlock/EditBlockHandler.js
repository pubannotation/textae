import EditTypeValuesDialog from '../../../../../component/EditTypeValuesDialog'
import DefaultHandler from '../DefaultHandler'

export default class EditBlockHandler extends DefaultHandler {
  constructor(
    editorHTMLElement,
    definitionContainer,
    commander,
    annotationData,
    selectionModel,
    typeValuesPallet,
    getAutocompletionWs
  ) {
    super(
      editorHTMLElement,
      'entity',
      definitionContainer,
      commander,
      annotationData,
      selectionModel.entity,
      typeValuesPallet
    )

    this._editorHTMLElement = editorHTMLElement
    this._selectionModel = selectionModel
    this._annotationData = annotationData
    this._getAutocompletionWs = getAutocompletionWs
    this._typeValuesPallet = typeValuesPallet
  }

  editTypeValues() {
    if (this._selectionModel.entity.some) {
      new EditTypeValuesDialog(
        this._editorHTMLElement,
        'Block',
        this._definitionContainer,
        this._annotationData.typeDefinition.attribute,
        this._getAutocompletionWs(),
        this._selectionModel.entity.all,
        this._typeValuesPallet
      )
        .open()
        .then((values) => this._typeValuesChanged(values))
    }
  }
}

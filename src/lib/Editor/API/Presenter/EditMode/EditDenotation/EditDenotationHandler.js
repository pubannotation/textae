import EditTypeValuesDialog from '../../../../../component/EditTypeValuesDialog'
import SelectionAttributePallet from '../../../../../component/SelectionAttributePallet'
import DefaultHandler from '../DefaultHandler'
import AttributeEditor from '../DefaultHandler/AttributeEditor'

export default class EditDenotationHandler extends DefaultHandler {
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

    this._attributeEditor = new AttributeEditor(
      commander,
      annotationData,
      selectionModel.entity,
      new SelectionAttributePallet(editorHTMLElement),
      () => this.editTypeValues(),
      typeValuesPallet
    )

    this._editorHTMLelement = editorHTMLElement
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._getAutocompletionWs = getAutocompletionWs
    this._typeValuesPallet = typeValuesPallet
  }

  editTypeValues() {
    if (this._selectionModel.entity.some) {
      new EditTypeValuesDialog(
        this._editorHTMLelement,
        'Entity',
        'Entity',
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

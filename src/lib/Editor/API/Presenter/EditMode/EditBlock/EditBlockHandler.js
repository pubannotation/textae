import EditTypeValuesDialog from '../../../../../component/EditTypeValuesDialog'
import SelectionAttributePallet from '../../../../../component/SelectionAttributePallet'
import DefaultHandler from '../DefaultHandler'
import AttributeEditor from '../DefaultHandler/AttributeEditor'

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
    super('entity', definitionContainer, commander)

    this._attributeEditor = new AttributeEditor(
      commander,
      annotationData,
      selectionModel.entity,
      new SelectionAttributePallet(editorHTMLElement),
      () => this.editTypeValues(),
      typeValuesPallet
    )

    this._editorHTMLElement = editorHTMLElement
    this._selectionModel = selectionModel
    this._annotationData = annotationData
    this._getAutocompletionWs = getAutocompletionWs
    this._typeValuesPallet = typeValuesPallet
  }

  manipulateAttribute(number, shiftKey) {
    if (shiftKey) {
      this._attributeEditor.deleteAt(number)
    } else {
      this._attributeEditor.addOrEditAt(number)
    }
  }

  editTypeValues() {
    if (this._selectionModel.entity.some) {
      new EditTypeValuesDialog(
        this._editorHTMLElement,
        'Block',
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

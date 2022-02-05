import DefaultHandler from '../DefaultHandler'
import EditTypeValuesDialog from '../../../../../component/EditTypeValuesDialog'

export default class EditRelationHandler extends DefaultHandler {
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
      'relation',
      definitionContainer,
      commander,
      annotationData,
      selectionModel.relation,
      typeValuesPallet
    )

    this._editorHTMLElement = editorHTMLElement
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._getAutocompletionWs = getAutocompletionWs
    this._typeValuesPallet = typeValuesPallet
  }

  editTypeValues() {
    if (this._selectionModel.relation.some) {
      new EditTypeValuesDialog(
        this._editorHTMLElement,
        'Relation',
        'Relation',
        this._definitionContainer,
        this._annotationData.typeDefinition.attribute,
        this._getAutocompletionWs(),
        this._selectionModel.relation.all,
        this._typeValuesPallet
      )
        .open()
        .then((values) => this._typeValuesChanged(values))
    }
  }

  relationClicked(event, relation) {
    if (event.ctrlKey || event.metaKey) {
      this._selectionModel.relation.toggle(relation.id)
    } else {
      this._selectionModel.selectRelation(relation.id)
    }
  }

  _getSelectedType() {
    const relation = this._selectionModel.relation.single

    if (relation) {
      return relation.typeName
    }

    return ''
  }
}
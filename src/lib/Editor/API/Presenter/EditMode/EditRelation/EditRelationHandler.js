import DefaultHandler from '../DefaultHandler'

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
    super('relation', definitionContainer, commander)

    this._editorHTMLElement = editorHTMLElement
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._getAutocompletionWs = getAutocompletionWs
    this._typeValuesPallet = typeValuesPallet
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

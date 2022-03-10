import DefaultHandler from '../DefaultHandler'

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
    super('entity', definitionContainer, commander)

    this._editorHTMLelement = editorHTMLElement
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._getAutocompletionWs = getAutocompletionWs
    this._typeValuesPallet = typeValuesPallet
  }
}

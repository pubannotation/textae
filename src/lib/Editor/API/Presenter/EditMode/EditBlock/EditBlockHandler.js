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
    super('entity', definitionContainer, commander)

    this._editorHTMLElement = editorHTMLElement
    this._selectionModel = selectionModel
    this._annotationData = annotationData
    this._getAutocompletionWs = getAutocompletionWs
    this._typeValuesPallet = typeValuesPallet
  }
}

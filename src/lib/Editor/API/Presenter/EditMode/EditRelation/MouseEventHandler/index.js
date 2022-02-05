import typeValuesClicked from './typeValuesClicked'

export default class MouseEventHandler {
  constructor(
    editorHTMLElement,
    selectionModel,
    commander,
    typeDefinition,
    pallet
  ) {
    this._editorHTMLElement = editorHTMLElement
    this._selectionModel = selectionModel
    this._commander = commander
    this._typeDefinition = typeDefinition
    this._pallet = pallet
  }

  bodyClicked() {
    this._pallet.hide()
    this._selectionModel.removeAll()
  }

  signboardClicked() {
    this._editorHTMLElement.focus()
  }

  typeValuesClicked(e) {
    typeValuesClicked(
      this._selectionModel,
      this._commander,
      this._typeDefinition.relation,
      e
    )
  }
}

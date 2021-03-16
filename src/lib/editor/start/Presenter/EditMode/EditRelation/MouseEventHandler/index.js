import clickEntity from './clickEntity'
import getEntityHTMLelementFromChild from '../../../../getEntityHTMLelementFromChild'

export default class MouseEventHandler {
  constructor(editor, selectionModel, commander, typeDefinition, pallet) {
    this._editor = editor
    this._selectionModel = selectionModel
    this._commander = commander
    this._typeDefinition = typeDefinition
    this._pallet = pallet
  }

  bodyClicked() {
    this._pallet.hide()
    this._selectionModel.removeAll()
  }

  textBoxClicked() {
    this._pallet.hide()
    this._selectionModel.removeAll()
  }

  signboardClicked() {
    this._editor.focus()
  }

  typeValuesClicked(e) {
    clickEntity(
      this._selectionModel,
      getEntityHTMLelementFromChild(e.target).title,
      this._commander,
      this._typeDefinition.relation,
      e
    )
  }
}

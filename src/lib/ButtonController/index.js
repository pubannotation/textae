import PushButtons from './PushButtons'
import EnableState from './EnableState'

export default class {
  constructor(editor, selectionModel, clipBoard) {
    this._enableState = new EnableState(editor, selectionModel, clipBoard)
    // Save state of push control buttons.
    this._pushButtons = new PushButtons(editor)
  }

  propagate() {
    this._enableState.propagate()
    this._pushButtons.propagate()
  }

  toggle(buttonName) {
    return this._pushButtons.getButton(buttonName).toggle()
  }

  valueOf(buttonName) {
    return this._pushButtons.getButton(buttonName).value()
  }

  setPushButtonsForMode(mode, editable) {
    this._pushButtons.setForMode(mode, editable)
  }
}

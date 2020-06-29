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

  get pushButtonNames() {
    return this._pushButtons.names
  }

  toggle(buttonName) {
    return this._pushButtons.getButton(buttonName).toggle()
  }

  valueOf(buttonName) {
    return this._pushButtons.getButton(buttonName).value()
  }
}

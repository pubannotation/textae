import PushButtons from './PushButtons'
import ButtonStateHelper from './ButtonStateHelper'
import setButtonState from './setButtonState'

export default class {
  constructor(editor, annotationData, selectionModel, clipBoard) {
    // Save state of push control buttons.
    this._pushButtons = new PushButtons(editor, annotationData)

    // Helper to update button state.
    this._buttonStateHelper = new ButtonStateHelper(
      editor,
      this._pushButtons,
      selectionModel,
      clipBoard
    )
  }

  get pushButtons() {
    return this._pushButtons
  }

  get buttonStateHelper() {
    return this._buttonStateHelper
  }

  setButtonState(editable, mode) {
    setButtonState(this, editable, mode)
  }
}

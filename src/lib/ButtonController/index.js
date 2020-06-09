import PushButtons from './PushButtons'
import ButtonEnableStates from './ButtonEnableStates'
import ButtonStateHelper from './ButtonStateHelper'
import setButtonState from './setButtonState'

export default class {
  constructor(editor, annotationData, selectionModel, clipBoard) {
    // Save state of push control buttons.
    this._pushButtons = new PushButtons(editor, annotationData)

    // Save enable/disable state of contorol buttons.
    const buttonEnableStates = new ButtonEnableStates(
      editor,
      selectionModel,
      clipBoard
    )

    // Helper to update button state.
    this._buttonStateHelper = new ButtonStateHelper(
      buttonEnableStates,
      this._pushButtons,
      selectionModel
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

import PushButtons from './PushButtons'
import ButtonEnableStates from './ButtonEnableStates'
import ButtonTransitStates from './ButtonTransitStates'
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

    // Toggle class to transit icon image.
    const buttonTransitStates = new ButtonTransitStates(editor)

    // Helper to update button state.
    this._buttonStateHelper = new ButtonStateHelper(
      buttonEnableStates,
      buttonTransitStates,
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

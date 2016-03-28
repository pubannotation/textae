import {
  EventEmitter as EventEmitter
}
from 'events'
import ModeAccordingToButton from './ModeAccordingToButton'
import ButtonEnableStates from './ButtonEnableStates'
import UpdateButtonState from './UpdateButtonState'
import UpdateModificationButtons from './UpdateModificationButtons'
import ButtonStateHelper from './ButtonStateHelper'

module.exports = function(editor, model, clipBoard) {
  // Save state of push control buttons.
  const modeAccordingToButton = new ModeAccordingToButton(),
    // Save enable/disable state of contorol buttons.
    buttonEnableStates = new ButtonEnableStates(),
    updateButtonState = new UpdateButtonState(model, buttonEnableStates, clipBoard),
    // Change push/unpush of buttons of modifications.
    updateModificationButtons = new UpdateModificationButtons(model, modeAccordingToButton),
    // Helper to update button state.
    buttonStateHelper = new ButtonStateHelper(
      model,
      modeAccordingToButton,
      buttonEnableStates,
      updateButtonState,
      updateModificationButtons
    )

  // Proragate events.
  modeAccordingToButton.on('change', (data) => editor.eventEmitter.emit('textae.control.button.push', data))
  buttonEnableStates.on('change', (data) => editor.eventEmitter.emit('textae.control.buttons.change', data))

  return {
    modeAccordingToButton,
    buttonStateHelper,
  }
}

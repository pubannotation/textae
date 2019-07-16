import ModeAccordingToButton from './ModeAccordingToButton'
import ButtonEnableStates from './ButtonEnableStates'
import UpdateButtonState from './UpdateButtonState'
import UpdateModificationButtons from './UpdateModificationButtons'
import ButtonTransitStates from './ButtonTransitStates'
import ButtonStateHelper from './ButtonStateHelper'

export default function(editor, annotationData, selectionModel, clipBoard) {
  // Save state of push control buttons.
  const modeAccordingToButton = new ModeAccordingToButton()

  // Save enable/disable state of contorol buttons.
  const buttonEnableStates = new ButtonEnableStates()

  const updateButtonState = new UpdateButtonState(selectionModel, buttonEnableStates, clipBoard)

  // Change push/unpush of buttons of modifications.
  const updateModificationButtons = new UpdateModificationButtons(annotationData, modeAccordingToButton)

  // Toggle class to transit icon image.
  const buttonTransitStates = new ButtonTransitStates()

  // Helper to update button state.
  const buttonStateHelper = new ButtonStateHelper(
    selectionModel,
    modeAccordingToButton,
    buttonEnableStates,
    updateButtonState,
    buttonTransitStates,
    updateModificationButtons
  )

  // Proragate events.
  modeAccordingToButton.on('change', (data) => editor.eventEmitter.emit('textae.control.button.push', data))
  buttonEnableStates.on('change', (data) => editor.eventEmitter.emit('textae.control.buttons.change', data))
  buttonTransitStates.on('change', (data) => editor.eventEmitter.emit('textae.control.buttons.transit', data))

  return {
    modeAccordingToButton,
    buttonStateHelper,
  }
}

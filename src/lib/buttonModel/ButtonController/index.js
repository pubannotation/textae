import ModeAccordingToButton from './ModeAccordingToButton'
import ButtonEnableStates from './ButtonEnableStates'
import ButtonTransitStates from './ButtonTransitStates'
import ButtonStateHelper from './ButtonStateHelper'

export default function(editor, annotationData, selectionModel, clipBoard) {
  // Save state of push control buttons.
  const modeAccordingToButton = new ModeAccordingToButton()

  // Save enable/disable state of contorol buttons.
  const buttonEnableStates = new ButtonEnableStates(selectionModel, buttonEnableStates, clipBoard)

  // Toggle class to transit icon image.
  const buttonTransitStates = new ButtonTransitStates()

  // Helper to update button state.
  const buttonStateHelper = new ButtonStateHelper(
    buttonEnableStates,
    buttonTransitStates,
    annotationData,
    modeAccordingToButton,
    selectionModel
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

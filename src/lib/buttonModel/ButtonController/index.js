import PushButtons from './PushButtons'
import ButtonEnableStates from './ButtonEnableStates'
import ButtonTransitStates from './ButtonTransitStates'
import ButtonStateHelper from './ButtonStateHelper'

export default function(editor, annotationData, selectionModel, clipBoard) {
  // Save state of push control buttons.
  const pushButtons = new PushButtons(editor, annotationData)

  // Save enable/disable state of contorol buttons.
  const buttonEnableStates = new ButtonEnableStates(
    editor,
    selectionModel,
    clipBoard
  )

  // Toggle class to transit icon image.
  const buttonTransitStates = new ButtonTransitStates(editor)

  // Helper to update button state.
  const buttonStateHelper = new ButtonStateHelper(
    buttonEnableStates,
    buttonTransitStates,
    pushButtons,
    selectionModel
  )

  return {
    pushButtons,
    buttonStateHelper
  }
}

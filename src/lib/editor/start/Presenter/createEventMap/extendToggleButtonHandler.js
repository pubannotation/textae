import ToggleButtonHandler from './handlers/ToggleButtonHandler'

export default function(buttonController, editMode, event) {
  const toggleButtonHandler = new ToggleButtonHandler(buttonController.modeAccordingToButton, editMode)
  Object.assign(event, toggleButtonHandler)
}

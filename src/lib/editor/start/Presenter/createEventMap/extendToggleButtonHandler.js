import ToggleButtonHandler from './handlers/ToggleButtonHandler'

export default function(buttonController, editMode, event) {
  const toggleButtonHandler = new ToggleButtonHandler(buttonController.pushButtons, editMode)
  Object.assign(event, toggleButtonHandler)
}

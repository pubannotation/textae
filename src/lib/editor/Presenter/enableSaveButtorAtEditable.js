import setButtonState from './setButtonState'

export default function(writable, editMode, buttonController) {
  let latestWritableState = false,
    editModeEditable = false

  writable(val => {
    latestWritableState = val
    buttonController.buttonStateHelper.enabled("write", val && editModeEditable)
  })

  editMode
    .on('change', (editable, mode) => setButtonState(buttonController, editable, mode))
    .on('change', (editable, mode) => {
      // Enable the save button only at edit mode.
      editModeEditable = editable

      if (editable) {
        buttonController.buttonStateHelper.enabled("write", latestWritableState)
      } else {
        buttonController.buttonStateHelper.enabled("write", false)
      }
    })
}

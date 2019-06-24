import setButtonState from './setButtonState'

export default function(writable, editMode, buttonController) {
  let latestWritableState = false

  writable(val => {
    latestWritableState = val
    buttonController.buttonStateHelper.transit('write', latestWritableState)
  })

  editMode.on('change', (editable, mode) => setButtonState(buttonController, editable, mode))
}

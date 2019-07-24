import setButtonState from './setButtonState'

export default function(editMode, buttonController) {
  editMode.on('change', (editable, mode) =>
    setButtonState(buttonController, editable, mode)
  )
}

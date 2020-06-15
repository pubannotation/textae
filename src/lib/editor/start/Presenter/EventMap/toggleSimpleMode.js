export default function(buttonController, editMode) {
  if (buttonController.valueOf('simple')) {
    editMode.upSimple()
  } else {
    editMode.pushSimple()
  }
}

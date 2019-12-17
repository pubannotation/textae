export default function(pushButtons, editMode) {
  if (pushButtons.getButton('simple').value()) {
    editMode.upSimple()
  } else {
    editMode.pushSimple()
  }
}

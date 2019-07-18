export default function(pushButtons, editMode) {
  return {
    toggleSimpleMode: () => toggleSimpleMode(pushButtons, editMode),
    toggleDetectBoundaryMode: () => toggleDetectBoundaryMode(pushButtons),
    toggleInstaceRelation: () => toggleInstaceRelation(editMode)
  }
}

function toggleSimpleMode(pushButtons, editMode) {
  if (pushButtons.getButton('simple').value()) {
    editMode.upSimple()
  } else {
    editMode.pushSimple()
  }
}

function toggleDetectBoundaryMode(pushButtons) {
  pushButtons.getButton('boundary-detection').toggle()
}

function toggleInstaceRelation(editMode) {
  editMode.toggleInstaceRelation()
}

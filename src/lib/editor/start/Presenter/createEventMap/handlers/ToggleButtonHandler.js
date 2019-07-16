export default function(modeAccordingToButton, editMode) {
  return {
    toggleSimpleMode: () => toggleSimpleMode(modeAccordingToButton, editMode),
    toggleDetectBoundaryMode: () => toggleDetectBoundaryMode(modeAccordingToButton),
    toggleInstaceRelation: () => toggleInstaceRelation(editMode)
  }
}

function toggleSimpleMode(modeAccordingToButton, editMode) {
  if (modeAccordingToButton.getButton('simple').value()) {
    editMode.upSimple()
  } else {
    editMode.pushSimple()
  }
}

function toggleDetectBoundaryMode(modeAccordingToButton) {
  modeAccordingToButton.getButton('boundary-detection').toggle()
}

function toggleInstaceRelation(editMode) {
  editMode.toggleInstaceRelation()
}

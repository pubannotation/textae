import _ from 'underscore'

export default function(annotationData, modeAccordingToButton) {
  return function(selectionModel) {
    const modifications = selectionModel.all().map((e) => annotationData.getModificationOf(e).map((m) => m.pred))

    updateModificationButton(modeAccordingToButton, 'Negation', modifications)
    updateModificationButton(modeAccordingToButton, 'Speculation', modifications)
  }
}

function updateModificationButton(modeAccordingToButton, specified, modificationsOfSelectedElement) {
  // All modification has specified modification if exits.
  modeAccordingToButton[specified.toLowerCase()]
    .value(doesAllModificaionHasSpecified(specified, modificationsOfSelectedElement))
}

function doesAllModificaionHasSpecified(specified, modificationsOfSelectedElement) {
  if (modificationsOfSelectedElement.length < 0) {
    return false
  }

  return modificationsOfSelectedElement.length === modificationsOfSelectedElement.filter((m) => m.includes(specified)).length
}


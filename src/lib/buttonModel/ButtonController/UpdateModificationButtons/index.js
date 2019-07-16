import updateModificationButton from "./updateModificationButton"

export default function(annotationData, modeAccordingToButton) {
  return function(selectionModel) {
    const modifications = selectionModel.all().map((e) => annotationData.getModificationOf(e).map((m) => m.pred))

    updateModificationButton(modeAccordingToButton, 'Negation', modifications)
    updateModificationButton(modeAccordingToButton, 'Speculation', modifications)
  }
}

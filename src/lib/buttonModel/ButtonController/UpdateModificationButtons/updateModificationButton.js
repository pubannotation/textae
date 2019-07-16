import doesAllModificaionHasSpecified from "./doesAllModificaionHasSpecified"

export default function(modeAccordingToButton, specified, modificationsOfSelectedElement) {
  // All modification has specified modification if exits.
  modeAccordingToButton[specified.toLowerCase()]
    .value(doesAllModificaionHasSpecified(specified, modificationsOfSelectedElement))
}

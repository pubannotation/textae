import doesAllModificaionHasSpecified from './doesAllModificaionHasSpecified'

export default function(
  modeAccordingToButton,
  specified,
  modificationsOfSelectedElement
) {
  // All modification has specified modification if exits.
  modeAccordingToButton
    .getButton(specified.toLowerCase())
    .value(
      doesAllModificaionHasSpecified(specified, modificationsOfSelectedElement)
    )
}

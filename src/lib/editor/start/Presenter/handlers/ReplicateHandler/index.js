import replicate from './replicate'

export default function(command, annotationData, selectionModel, modeAccordingToButton, spanConfig) {
  return function() {
    replicate(
        command,
        annotationData,
        modeAccordingToButton,
        spanConfig,
        selectionModel.span.single()
    )
 }
}

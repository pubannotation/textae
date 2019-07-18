import replicate from './replicate'

export default function(command, annotationData, selectionModel, pushButtons, spanConfig) {
  return function() {
    replicate(
        command,
        annotationData,
        pushButtons,
        spanConfig,
        selectionModel.span.single()
    )
 }
}

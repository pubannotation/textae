import replicate from './replicate'

export default function(
  commander,
  annotationData,
  selectionModel,
  pushButtons,
  spanConfig
) {
  return function() {
    replicate(
      commander,
      annotationData,
      pushButtons,
      spanConfig,
      selectionModel.span.single()
    )
  }
}

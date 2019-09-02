export default function(
  commander,
  annotationData,
  pushButtons,
  spanConfig,
  spanId
) {
  const detectBoundaryFunc = getDetectBoundaryFunc(pushButtons, spanConfig)
  const span = annotationData.span.get(spanId)

  if (spanId) {
    commander.invoke(
      commander.factory.spanReplicateCommand(span, detectBoundaryFunc)
    )
  } else {
    alert('You can replicate span annotation when there is only span selected.')
  }
}

function getDetectBoundaryFunc(pushButtons, spanConfig) {
  if (pushButtons.getButton('boundary-detection').value()) {
    return spanConfig.isDelimiter
  } else {
    return null
  }
}

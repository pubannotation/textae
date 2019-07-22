export default function(command, annotationData, pushButtons, spanConfig, spanId) {
  const detectBoundaryFunc = getDetectBoundaryFunc(pushButtons, spanConfig)
  const span = annotationData.span.get(spanId)

  if (spanId) {
    command.invoke(
      [command.factory.spanReplicateCommand(
        span,
        span.getTypes().map((t) => t.name),
        detectBoundaryFunc
      )],
      ['annotation']
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

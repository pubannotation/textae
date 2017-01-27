export default function(command, annotationData, modeAccordingToButton, spanConfig, spanId, entity) {
  const detectBoundaryFunc = getDetectBoundaryFunc(modeAccordingToButton, spanConfig),
    span = annotationData.span.get(spanId)

  if (spanId) {
    command.invoke(
      [command.factory.spanReplicateCommand(
        span,
        span.getTypes().map((t) => t.name),
        detectBoundaryFunc
      )]
    )
  } else {
    alert('You can replicate span annotation when there is only span selected.')
  }
}

function getDetectBoundaryFunc(modeAccordingToButton, spanConfig) {
  if (modeAccordingToButton['boundary-detection'].value()) {
    return spanConfig.isDelimiter
  } else {
    return null
  }
}

export default function(command, annotationData, modeAccordingToButton, spanConfig, spanId) {
  const detectBoundaryFunc = getDetectBoundaryFunc(modeAccordingToButton, spanConfig),
    span = annotationData.span.get(spanId)

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

function getDetectBoundaryFunc(modeAccordingToButton, spanConfig) {
  if (modeAccordingToButton.getButton('boundary-detection').value()) {
    return spanConfig.isDelimiter
  } else {
    return null
  }
}

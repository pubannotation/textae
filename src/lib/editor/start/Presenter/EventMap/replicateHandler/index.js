import getDetectBoundaryFunc from './getDetectBoundaryFunc'

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
      commander.factory.replicateSpanCommand(
        span,
        span.types,
        detectBoundaryFunc
      )
    )
  } else {
    alert('You can replicate span annotation when there is only span selected.')
  }
}

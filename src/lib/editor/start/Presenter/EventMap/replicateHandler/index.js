import getDetectBoundaryFunc from './getDetectBoundaryFunc'

export default function(commander, buttonController, spanConfig, span) {
  const detectBoundaryFunc = getDetectBoundaryFunc(buttonController, spanConfig)

  if (span) {
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

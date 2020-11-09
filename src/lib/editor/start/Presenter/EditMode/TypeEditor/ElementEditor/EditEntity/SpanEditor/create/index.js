import createCommand from './createCommand'
import getNewSpan from './getNewSpan'

export default function (
  annotationData,
  commander,
  spanAdjuster,
  isReplicateAuto,
  selectionWrapper,
  spanConfig,
  isDelimiterFunc
) {
  const { begin, end } = getNewSpan(
    annotationData,
    spanAdjuster,
    selectionWrapper,
    spanConfig
  )

  // The span cross exists spans.
  if (annotationData.span.isBoundaryCrossingWithOtherSpans(begin, end)) {
    return
  }

  // The span exists already.
  if (annotationData.span.hasDenotationSpan(begin, end)) {
    return
  }

  const command = createCommand(
    commander,
    { begin, end },
    isReplicateAuto,
    isDelimiterFunc
  )

  commander.invoke(command)
}

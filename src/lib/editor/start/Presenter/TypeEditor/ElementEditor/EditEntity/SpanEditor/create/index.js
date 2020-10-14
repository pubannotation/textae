import createCommand from './createCommand'
import getNewSpan from './getNewSpan'

export default function(
  annotationData,
  commander,
  spanAdjuster,
  isDetectDelimiterEnable,
  isReplicateAuto,
  selectionWrapper,
  spanConfig
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
  if (annotationData.span.hasObjectSpan(begin, end)) {
    return
  }

  const command = createCommand(
    commander,
    { begin, end },
    isReplicateAuto,
    isDetectDelimiterEnable,
    spanConfig
  )

  commander.invoke(command)
}

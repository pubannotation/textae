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
  const newSpan = getNewSpan(
    annotationData,
    spanAdjuster,
    selectionWrapper,
    spanConfig
  )

  // The span cross exists spans.
  if (annotationData.span.isBoundaryCrossingWithOtherSpans(newSpan)) {
    return
  }

  // The span exists already.
  if (annotationData.span.hasObjectSpan(newSpan)) {
    return
  }

  const command = createCommand(
    commander,
    newSpan,
    isReplicateAuto,
    isDetectDelimiterEnable,
    spanConfig
  )

  commander.invoke(command)
}

import isAlreadySpaned from '../../../../../../isAlreadySpaned'
import createCommands from './createCommands'
import getNewSpan from './getNewSpan'

export default function(
  annotationData,
  commander,
  spanAdjuster,
  isDetectDelimiterEnable,
  isReplicateAuto,
  selection,
  spanConfig
) {
  const newSpan = getNewSpan(
    annotationData,
    spanAdjuster,
    selection,
    spanConfig
  )

  // The span cross exists spans.
  if (annotationData.span.isBoundaryCrossingWithOtherSpans(newSpan)) {
    return
  }

  // The span exists already.
  if (isAlreadySpaned(annotationData.span.all, newSpan)) {
    return
  }

  const commands = createCommands(
    commander,
    newSpan,
    isReplicateAuto,
    isDetectDelimiterEnable,
    spanConfig
  )

  commander.invoke(commands)
}

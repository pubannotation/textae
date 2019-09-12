import isBoundaryCrossingWithOtherSpans from '../../../../../../Model/AnnotationData/parseAnnotation/validateAnnotation/isBoundaryCrossingWithOtherSpans'
import isAlreadySpaned from '../../../../../isAlreadySpaned'
import createCommands from './createCommands'
import getNewSpan from './getNewSpan'

export default function(
  annotationData,
  commander,
  typeDefinition,
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
  if (isBoundaryCrossingWithOtherSpans(annotationData.span.all, newSpan)) {
    return
  }

  // The span exists already.
  if (isAlreadySpaned(annotationData.span.all, newSpan)) {
    return
  }

  const commands = createCommands(
    commander,
    typeDefinition,
    newSpan,
    isReplicateAuto,
    isDetectDelimiterEnable,
    spanConfig
  )

  commander.invoke(commands)
}

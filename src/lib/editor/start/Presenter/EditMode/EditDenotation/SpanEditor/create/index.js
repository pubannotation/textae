import alertifyjs from 'alertifyjs'
import createCommand from './createCommand'
import getNewSpan from '../../../getNewSpan'

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
    alertifyjs.warning('A span cannot be modifyed to make a boundary crossing.')
    return
  }

  // The span exists already.
  if (annotationData.span.hasDenotationSpan(begin, end)) {
    return
  }

  // There is a BlockSpan that is a child.
  if (annotationData.span.hasBlockSpanBetween(begin, end)) {
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

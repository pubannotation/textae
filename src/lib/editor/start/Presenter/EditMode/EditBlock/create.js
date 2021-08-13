import getNewSpan from '../getNewSpan'

export default function (
  annotationData,
  commander,
  spanAdjuster,
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

  if (annotationData.span.doesParentOrSameSpanExist(begin, end)) {
    return
  }

  const command = commander.factory.createBlockSpanCommand({
    begin,
    end
  })

  commander.invoke(command)
}

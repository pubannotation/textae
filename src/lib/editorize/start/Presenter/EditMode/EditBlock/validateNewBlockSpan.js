import alertifyjs from 'alertifyjs'

export default function (annotationData, begin, end, spanId) {
  // The span cross exists spans.
  if (annotationData.span.isBoundaryCrossingWithOtherSpans(begin, end)) {
    alertifyjs.warning('A span cannot be modifyed to make a boundary crossing.')
    return false
  }

  if (annotationData.span.doesParentOrSameSpanExist(begin, end)) {
    return false
  }

  // There is a BlockSpan that is a child.
  if (
    annotationData.span.hasBlockSpanBetween(begin, end, { excluded: spanId })
  ) {
    return false
  }

  return true
}

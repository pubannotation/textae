export default function (annotationData, begin, end) {
  // The span cross exists spans.
  if (annotationData.span.isBoundaryCrossingWithOtherSpans(begin, end)) {
    return false
  }

  if (annotationData.span.doesParentOrSameSpanExist(begin, end)) {
    return false
  }

  // There is a BlockSpan that is a child.
  if (annotationData.span.hasBlockSpanBetween(begin, end)) {
    return false
  }

  return true
}

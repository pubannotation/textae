import alertifyjs from 'alertifyjs'

export default function (annotationData, begin, end) {
  // The span cross exists spans.
  if (annotationData.span.isBoundaryCrossingWithOtherSpans(begin, end)) {
    alertifyjs.warning('A span cannot be modifyed to make a boundary crossing.')
    return false
  }

  // The span exists already.
  if (annotationData.span.hasDenotationSpan(begin, end)) {
    return false
  }

  // There is a BlockSpan that is a child.
  if (annotationData.span.hasBlockSpanBetween(begin, end)) {
    return false
  }

  return true
}

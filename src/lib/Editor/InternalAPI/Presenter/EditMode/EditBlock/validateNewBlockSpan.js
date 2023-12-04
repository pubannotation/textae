import alertifyjs from 'alertifyjs'

export default function (annotationModel, begin, end, spanID) {
  // The span cross exists spans.
  if (annotationModel.span.isBoundaryCrossingWithOtherSpans(begin, end)) {
    alertifyjs.warning('A span cannot be modifyed to make a boundary crossing.')
    return false
  }

  if (annotationModel.span.doesParentOrSameSpanExist(begin, end)) {
    return false
  }

  // There is a BlockSpan that is a child.
  if (
    annotationModel.span.hasBlockSpanBetween(begin, end, { excluded: spanID })
  ) {
    return false
  }

  return true
}

import alertifyjs from 'alertifyjs'

/**
 *
 * @param {import('../../../../../AnnotationData/SpanModelContainer').default} spanModelContainer
 * @returns
 */
export default function (spanModelContainer, begin, end) {
  // The span cross exists spans.
  if (spanModelContainer.isBoundaryCrossingWithOtherSpans(begin, end)) {
    alertifyjs.warning('A span cannot be modifyed to make a boundary crossing.')
    return false
  }

  // The span exists already.
  if (spanModelContainer.hasDenotationSpan(begin, end)) {
    return false
  }

  // There is a BlockSpan that is a child.
  if (spanModelContainer.hasBlockSpanBetween(begin, end)) {
    return false
  }

  return true
}

import getSpansTheirStringIsSameWith from './getSpansTheirStringIsSameWith'
import isWord from './isWord'

// Check replications are word or not if spanConfig is set.
export default function(annotationData, originSpan, detectBoundaryFunc) {
  const wordFilter = detectBoundaryFunc
    ? (span) => isWord(annotationData.sourceDoc, detectBoundaryFunc, span)
    : (span) => span

  return getSpansTheirStringIsSameWith(annotationData.sourceDoc, originSpan)
    .filter(
      (span) =>
        // The candidateSpan is a same span when begin is same.
        // Because string of each others are same. End of them are same too.
        span.begin !== originSpan.begin
    )
    .filter(wordFilter)
    .filter(({ begin, end }) => !annotationData.span.hasObjectSpan(begin, end))
    .filter(
      (span) =>
        !annotationData.span.isBoundaryCrossingWithOtherSpans(
          span.begin,
          span.end
        )
    )
}

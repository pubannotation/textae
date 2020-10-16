import getSpansTheirStringIsSameWith from './getSpansTheirStringIsSameWith'
import isWord from './isWord'

// Check replications are word or not if spanConfig is set.
export default function(annotationData, originSpan, detectBoundaryFunc) {
  const wordFilter = detectBoundaryFunc
    ? ({ begin, end }) =>
        isWord(annotationData.sourceDoc, detectBoundaryFunc, begin, end)
    : () => true

  return getSpansTheirStringIsSameWith(annotationData.sourceDoc, originSpan)
    .filter(
      ({ begin }) =>
        // The candidateSpan is a same span when begin is same.
        // Because string of each others are same. End of them are same too.
        begin !== originSpan.begin
    )
    .filter(wordFilter)
    .filter(({ begin, end }) => !annotationData.span.hasObjectSpan(begin, end))
    .filter(
      ({ begin, end }) =>
        !annotationData.span.isBoundaryCrossingWithOtherSpans(begin, end)
    )
}

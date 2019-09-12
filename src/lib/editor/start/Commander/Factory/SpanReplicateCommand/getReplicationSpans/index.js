import isBoundaryCrossingWithOtherSpans from '../../../../../isBoundaryCrossingWithOtherSpans'
import isAlreadySpaned from '../../../../isAlreadySpaned'
import getSpansTheirStringIsSameWith from './getSpansTheirStringIsSameWith'
import isWord from './isWord'

// Check replications are word or not if spanConfig is set.
export default function(dataStore, originSpan, detectBoundaryFunc) {
  const allSpans = dataStore.span.all
  const wordFilter = detectBoundaryFunc
    ? (span) => isWord(dataStore.sourceDoc, detectBoundaryFunc, span)
    : (span) => span

  return getSpansTheirStringIsSameWith(dataStore.sourceDoc, originSpan)
    .filter(
      (span) =>
        // The candidateSpan is a same span when begin is same.
        // Because string of each others are same. End of them are same too.
        span.begin !== originSpan.begin
    )
    .filter(wordFilter)
    .filter((span) => !isAlreadySpaned(allSpans, span))
    .filter((span) => !isBoundaryCrossingWithOtherSpans(allSpans, span))
}

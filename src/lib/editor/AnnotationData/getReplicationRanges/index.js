import getDuplicateSentenceFromText from './getDuplicateSentenceFromText'
import isWord from './isWord'

// Check replications are word or not if spanConfig is set.
export default function(sourceDoc, begin1, end, span, isDelimiterFunc) {
  return getDuplicateSentenceFromText(sourceDoc, begin1, end)
    .filter(
      ({ begin }) =>
        // The candidateSpan is a same span when begin is same.
        // Because string of each others are same. End of them are same too.
        begin !== begin1
    )
    .filter(({ begin, end }) => isWord(sourceDoc, begin, end, isDelimiterFunc))
    .filter(({ begin, end }) => !span.hasObjectSpan(begin, end))
    .filter(
      ({ begin, end }) => !span.isBoundaryCrossingWithOtherSpans(begin, end)
    )
}

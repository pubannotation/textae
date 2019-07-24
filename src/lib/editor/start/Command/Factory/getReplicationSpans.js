import not from 'not'
import isAlreadySpaned from '../../isAlreadySpaned'
import { isBoundaryCrossingWithOtherSpans } from '../../../Model/AnnotationData/parseAnnotation/validateAnnotation'
import _ from 'underscore'

// Check replications are word or not if spanConfig is set.
export default function(dataStore, originSpan, detectBoundaryFunc) {
  let allSpans = dataStore.span.all()
  let wordFilter = detectBoundaryFunc
    ? _.partial(isWord, dataStore.sourceDoc, detectBoundaryFunc)
    : _.identity

  return getSpansTheirStringIsSameWith(dataStore.sourceDoc, originSpan)
    .filter(
      (span) =>
        // The candidateSpan is a same span when begin is same.
        // Because string of each others are same. End of them are same too.
        span.begin !== originSpan.begin
    )
    .filter(wordFilter)
    .filter(not(_.partial(isAlreadySpaned, allSpans)))
    .filter(not(_.partial(isBoundaryCrossingWithOtherSpans, allSpans)))
}

// Get spans their stirng is same with the originSpan from sourceDoc.
function getSpansTheirStringIsSameWith(sourceDoc, originSpan) {
  let getNextStringIndex = String.prototype.indexOf.bind(
    sourceDoc,
    sourceDoc.substring(originSpan.begin, originSpan.end)
  )
  let length = originSpan.end - originSpan.begin
  let findStrings = []
  let offset = 0

  for (
    let index = getNextStringIndex(offset);
    index !== -1;
    index = getNextStringIndex(offset)
  ) {
    findStrings.push({
      begin: index,
      end: index + length
    })

    offset = index + length
  }

  return findStrings
}

// The preceding charactor and the following of a word charactor are delimiter.
// For example, 't' ,a part of 'that', is not same with an origin span when it is 't'.
function isWord(sourceDoc, detectBoundaryFunc, candidateSpan) {
  let precedingChar = sourceDoc.charAt(candidateSpan.begin - 1)
  let followingChar = sourceDoc.charAt(candidateSpan.end)

  return detectBoundaryFunc(precedingChar) && detectBoundaryFunc(followingChar)
}

import skipCharacters from './skipCharacters'
import skipBlank from './skipBlank'
import _ from 'underscore'

const getPrev = function(str, position) {
  return [str.charAt(position), str.charAt(position - 1)]
}
const getNext = function(str, position) {
  return [str.charAt(position), str.charAt(position + 1)]
}
const backToDelimiter = function(str, position, isDelimiter) {
  return skipCharacters(getPrev, -1, str, position, function(chars) {
    // Proceed the position between two characters as (!delimiter delimiter) || (delimiter !delimiter) || (!delimiter !delimiter).
    return chars[1] && !isDelimiter(chars[0]) && !isDelimiter(chars[1])
  })
}
const skipToDelimiter = function(str, position, isDelimiter) {
  return skipCharacters(getNext, 1, str, position, function(chars) {
    // Proceed the position between two characters as (!delimiter delimiter) || (delimiter !delimiter) || (!delimiter !delimiter).
    // Return false to stop an infinite loop when the character undefined.
    return chars[1] && !isDelimiter(chars[0]) && !isDelimiter(chars[1])
  })
}
const isNotWord = function(isBlankCharacter, isDelimiter, chars) {
  // The word is (no charactor || blank || delimiter)(!delimiter).
  return (
    (chars[0] !== '' &&
      !isBlankCharacter(chars[1]) &&
      !isDelimiter(chars[1])) ||
    isDelimiter(chars[0])
  )
}
const skipToWord = function(str, position, isWordEdge) {
  return skipCharacters(getPrev, 1, str, position, isWordEdge)
}
const backToWord = function(str, position, isWordEdge) {
  return skipCharacters(getNext, -1, str, position, isWordEdge)
}
const backFromBegin = function(str, beginPosition, spanConfig) {
  const nonEdgePos = skipBlank.forward(
    str,
    beginPosition,
    spanConfig.isBlankCharacter
  )
  const nonDelimPos = backToDelimiter(str, nonEdgePos, spanConfig.isDelimiter)

  return nonDelimPos
}
const forwardFromEnd = function(str, endPosition, spanConfig) {
  const nonEdgePos = skipBlank.back(
    str,
    endPosition,
    spanConfig.isBlankCharacter
  )
  const nonDelimPos = skipToDelimiter(str, nonEdgePos, spanConfig.isDelimiter)

  return nonDelimPos
}
// adjust the beginning position of a span for shortening
const forwardFromBegin = function(str, beginPosition, spanConfig) {
  const isWordEdge = _.partial(
    isNotWord,
    spanConfig.isBlankCharacter,
    spanConfig.isDelimiter
  )
  return skipToWord(str, beginPosition, isWordEdge)
}
// adjust the end position of a span for shortening
const backFromEnd = function(str, endPosition, spanConfig) {
  const isWordEdge = _.partial(
    isNotWord,
    spanConfig.isBlankCharacter,
    spanConfig.isDelimiter
  )
  return backToWord(str, endPosition, isWordEdge)
}

module.exports = {
  backFromBegin: backFromBegin,
  forwardFromEnd: forwardFromEnd,
  forwardFromBegin: forwardFromBegin,
  backFromEnd: backFromEnd
}

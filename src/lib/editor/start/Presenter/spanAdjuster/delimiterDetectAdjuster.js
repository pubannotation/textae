import skipCharacters from './skipCharacters'
import skipBlank from './skipBlank'
import _ from 'underscore'

var getPrev = function(str, position) {
  return [str.charAt(position), str.charAt(position - 1)]
}
var getNext = function(str, position) {
  return [str.charAt(position), str.charAt(position + 1)]
}
var backToDelimiter = function(str, position, isDelimiter) {
  return skipCharacters(getPrev, -1, str, position, function(chars) {
    // Proceed the position between two characters as (!delimiter delimiter) || (delimiter !delimiter) || (!delimiter !delimiter).
    return chars[1] && !isDelimiter(chars[0]) && !isDelimiter(chars[1])
  })
}
var skipToDelimiter = function(str, position, isDelimiter) {
  return skipCharacters(getNext, 1, str, position, function(chars) {
    // Proceed the position between two characters as (!delimiter delimiter) || (delimiter !delimiter) || (!delimiter !delimiter).
    // Return false to stop an infinite loop when the character undefined.
    return chars[1] && !isDelimiter(chars[0]) && !isDelimiter(chars[1])
  })
}
var isNotWord = function(isBlankCharacter, isDelimiter, chars) {
  // The word is (no charactor || blank || delimiter)(!delimiter).
  return (
    (chars[0] !== '' &&
      !isBlankCharacter(chars[1]) &&
      !isDelimiter(chars[1])) ||
    isDelimiter(chars[0])
  )
}
var skipToWord = function(str, position, isWordEdge) {
  return skipCharacters(getPrev, 1, str, position, isWordEdge)
}
var backToWord = function(str, position, isWordEdge) {
  return skipCharacters(getNext, -1, str, position, isWordEdge)
}
var backFromBegin = function(str, beginPosition, spanConfig) {
  var nonEdgePos = skipBlank.forward(
    str,
    beginPosition,
    spanConfig.isBlankCharacter
  )
  var nonDelimPos = backToDelimiter(str, nonEdgePos, spanConfig.isDelimiter)

  return nonDelimPos
}
var forwardFromEnd = function(str, endPosition, spanConfig) {
  var nonEdgePos = skipBlank.back(str, endPosition, spanConfig.isBlankCharacter)
  var nonDelimPos = skipToDelimiter(str, nonEdgePos, spanConfig.isDelimiter)

  return nonDelimPos
}
// adjust the beginning position of a span for shortening
var forwardFromBegin = function(str, beginPosition, spanConfig) {
  var isWordEdge = _.partial(
    isNotWord,
    spanConfig.isBlankCharacter,
    spanConfig.isDelimiter
  )
  return skipToWord(str, beginPosition, isWordEdge)
}
// adjust the end position of a span for shortening
var backFromEnd = function(str, endPosition, spanConfig) {
  var isWordEdge = _.partial(
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

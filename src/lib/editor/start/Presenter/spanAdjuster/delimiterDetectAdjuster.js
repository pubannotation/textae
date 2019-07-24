import skipCharacters from './skipCharacters'
import skipBlank from './skipBlank'
import _ from 'underscore'

var getPrev = function(str, position) {
    return [str.charAt(position), str.charAt(position - 1)]
  },
  getNext = function(str, position) {
    return [str.charAt(position), str.charAt(position + 1)]
  },
  backToDelimiter = function(str, position, isDelimiter) {
    return skipCharacters(getPrev, -1, str, position, function(chars) {
      // Proceed the position between two characters as (!delimiter delimiter) || (delimiter !delimiter) || (!delimiter !delimiter).
      return chars[1] && !isDelimiter(chars[0]) && !isDelimiter(chars[1])
    })
  },
  skipToDelimiter = function(str, position, isDelimiter) {
    return skipCharacters(getNext, 1, str, position, function(chars) {
      // Proceed the position between two characters as (!delimiter delimiter) || (delimiter !delimiter) || (!delimiter !delimiter).
      // Return false to stop an infinite loop when the character undefined.
      return chars[1] && !isDelimiter(chars[0]) && !isDelimiter(chars[1])
    })
  },
  isNotWord = function(isBlankCharacter, isDelimiter, chars) {
    // The word is (no charactor || blank || delimiter)(!delimiter).
    return (
      (chars[0] !== '' &&
        !isBlankCharacter(chars[1]) &&
        !isDelimiter(chars[1])) ||
      isDelimiter(chars[0])
    )
  },
  skipToWord = function(str, position, isWordEdge) {
    return skipCharacters(getPrev, 1, str, position, isWordEdge)
  },
  backToWord = function(str, position, isWordEdge) {
    return skipCharacters(getNext, -1, str, position, isWordEdge)
  },
  backFromBegin = function(str, beginPosition, spanConfig) {
    var nonEdgePos = skipBlank.forward(
        str,
        beginPosition,
        spanConfig.isBlankCharacter
      ),
      nonDelimPos = backToDelimiter(str, nonEdgePos, spanConfig.isDelimiter)

    return nonDelimPos
  },
  forwardFromEnd = function(str, endPosition, spanConfig) {
    var nonEdgePos = skipBlank.back(
        str,
        endPosition,
        spanConfig.isBlankCharacter
      ),
      nonDelimPos = skipToDelimiter(str, nonEdgePos, spanConfig.isDelimiter)

    return nonDelimPos
  },
  // adjust the beginning position of a span for shortening
  forwardFromBegin = function(str, beginPosition, spanConfig) {
    var isWordEdge = _.partial(
      isNotWord,
      spanConfig.isBlankCharacter,
      spanConfig.isDelimiter
    )
    return skipToWord(str, beginPosition, isWordEdge)
  },
  // adjust the end position of a span for shortening
  backFromEnd = function(str, endPosition, spanConfig) {
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

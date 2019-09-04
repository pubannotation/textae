import skipBlank from '../skipBlank'
import SpanAdjuster from '../SpanAdjuster'
import backToDelimiter from './backToDelimiter'
import skipToDelimiter from './skipToDelimiter'
import isNotWord from './isNotWord'
import skipToWord from './skipToWord'
import backToWord from './backToWord'

export default class extends SpanAdjuster {
  backFromBegin(str, beginPosition, spanConfig) {
    const nonEdgePos = skipBlank.forward(
      str,
      beginPosition,
      spanConfig.isBlankCharacter
    )
    const nonDelimPos = backToDelimiter(str, nonEdgePos, spanConfig.isDelimiter)

    return nonDelimPos
  }

  forwardFromEnd(str, endPosition, spanConfig) {
    const nonEdgePos = skipBlank.back(
      str,
      endPosition,
      spanConfig.isBlankCharacter
    )
    const nonDelimPos = skipToDelimiter(str, nonEdgePos, spanConfig.isDelimiter)

    return nonDelimPos
  }

  // adjust the beginning position of a span for shortening
  forwardFromBegin(str, beginPosition, spanConfig) {
    const isWordEdge = (chars) =>
      isNotWord(spanConfig.isBlankCharacter, spanConfig.isDelimiter, chars)
    return skipToWord(str, beginPosition, isWordEdge)
  }

  // adjust the end position of a span for shortening
  backFromEnd(str, endPosition, spanConfig) {
    const isWordEdge = (chars) =>
      isNotWord(spanConfig.isBlankCharacter, spanConfig.isDelimiter, chars)
    return backToWord(str, endPosition, isWordEdge)
  }
}

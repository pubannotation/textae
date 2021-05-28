import skipBlank from '../../editor/start/Presenter/EditMode/skipBlank'
import SpanAdjuster from '../../editor/start/Presenter/EditMode/SpanAdjuster'
import backToDelimiter from './backToDelimiter'
import skipToDelimiter from './skipToDelimiter'
import isNotWord from './isNotWord'
import skipToWord from './skipToWord'
import backToWord from './backToWord'

export default class DelimiterDetectAdjuster extends SpanAdjuster {
  backFromBegin(str, beginPosition, spanConfig) {
    const nonEdgePos = skipBlank.forward(str, beginPosition, (char) =>
      spanConfig.isBlankCharacter(char)
    )
    const nonDelimPos = backToDelimiter(str, nonEdgePos, (char) =>
      spanConfig.isDelimiter(char)
    )

    return nonDelimPos
  }

  forwardFromEnd(str, endPosition, spanConfig) {
    const nonEdgePos = skipBlank.back(str, endPosition, (char) =>
      spanConfig.isBlankCharacter(char)
    )
    const nonDelimPos = skipToDelimiter(str, nonEdgePos, (char) =>
      spanConfig.isDelimiter(char)
    )

    return nonDelimPos
  }

  // adjust the beginning position of a span for shortening
  forwardFromBegin(str, beginPosition, spanConfig) {
    const isWordEdge = (chars) =>
      isNotWord(
        (char) => spanConfig.isBlankCharacter(char),
        (char) => spanConfig.isDelimiter(char),
        chars
      )

    return skipToWord(str, beginPosition, isWordEdge)
  }

  // adjust the end position of a span for shortening
  backFromEnd(str, endPosition, spanConfig) {
    const isWordEdge = (chars) =>
      isNotWord(
        (char) => spanConfig.isBlankCharacter(char),
        (char) => spanConfig.isDelimiter(char),
        chars
      )

    return backToWord(str, endPosition, isWordEdge)
  }
}

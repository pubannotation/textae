import skipBlank from './skipBlank'
import SpanAdjuster from './SpanAdjuster'

export default class extends SpanAdjuster {
  backFromBegin(str, position, spanConfig) {
    return skipBlank.forward(str, position, spanConfig.isBlankCharacter)
  }

  forwardFromEnd(str, position, spanConfig) {
    return skipBlank.back(str, position, spanConfig.isBlankCharacter)
  }

  forwardFromBegin(str, position, spanConfig) {
    return skipBlank.forward(str, position, spanConfig.isBlankCharacter)
  }

  backFromEnd(str, position, spanConfig) {
    return skipBlank.back(str, position, spanConfig.isBlankCharacter)
  }
}

import skipBlank from '../editor/start/Presenter/EditMode/skipBlank'
import SpanAdjuster from './SpanAdjuster'

export default class BlankSkipAdjuster extends SpanAdjuster {
  backFromBegin(str, position, spanConfig) {
    return skipBlank.forward(str, position, (char) =>
      spanConfig.isBlankCharacter(char)
    )
  }

  forwardFromEnd(str, position, spanConfig) {
    return skipBlank.back(str, position, (char) =>
      spanConfig.isBlankCharacter(char)
    )
  }

  forwardFromBegin(str, position, spanConfig) {
    return skipBlank.forward(str, position, (char) =>
      spanConfig.isBlankCharacter(char)
    )
  }

  backFromEnd(str, position, spanConfig) {
    return skipBlank.back(str, position, (char) =>
      spanConfig.isBlankCharacter(char)
    )
  }
}

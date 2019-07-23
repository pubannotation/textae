import skipBlank from './skipBlank'

export default {
  backFromBegin(str, position, spanConfig) {
    return skipBlank.forward(str, position, spanConfig.isBlankCharacter)
  },
  forwardFromEn(str, position, spanConfig) {
    return skipBlank.back(str, position, spanConfig.isBlankCharacter)
  },
  forwardFromBegin(str, position, spanConfig) {
    return skipBlank.forward(str, position, spanConfig.isBlankCharacter)
  },
  backFromEnd(str, position, spanConfig) {
    return skipBlank.back(str, position, spanConfig.isBlankCharacter)
  }
}

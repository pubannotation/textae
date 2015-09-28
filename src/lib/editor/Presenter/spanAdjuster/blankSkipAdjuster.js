var skipBlank = require('./skipBlank')

module.exports = {
  backFromBegin: function(str, position, spanConfig) {
    return skipBlank.forward(str, position, spanConfig.isBlankCharacter)
  },
  forwardFromEnd: function(str, position, spanConfig) {
    return skipBlank.back(str, position, spanConfig.isBlankCharacter)
  },
  forwardFromBegin: function(str, position, spanConfig) {
    return skipBlank.forward(str, position, spanConfig.isBlankCharacter)
  },
  backFromEnd: function(str, position, spanConfig) {
    return skipBlank.back(str, position, spanConfig.isBlankCharacter)
  }
}

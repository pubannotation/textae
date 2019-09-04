import skipCharacters from './DelimiterDetectAdjuster/skipCharacters'

const getNow = function(str, position) {
  return str.charAt(position)
}
const skipForwardBlank = function(str, position, isBlankCharacter) {
  return skipCharacters(getNow, 1, str, position, isBlankCharacter)
}
const skipBackBlank = function(str, position, isBlankCharacter) {
  return skipCharacters(getNow, -1, str, position, isBlankCharacter)
}

module.exports = {
  forward: skipForwardBlank,
  back: skipBackBlank
}

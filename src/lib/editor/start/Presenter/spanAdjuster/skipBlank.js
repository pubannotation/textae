import skipCharacters from './skipCharacters'

var getNow = function(str, position) {
  return str.charAt(position)
}
var skipForwardBlank = function(str, position, isBlankCharacter) {
  return skipCharacters(getNow, 1, str, position, isBlankCharacter)
}
var skipBackBlank = function(str, position, isBlankCharacter) {
  return skipCharacters(getNow, -1, str, position, isBlankCharacter)
}

module.exports = {
  forward: skipForwardBlank,
  back: skipBackBlank
}

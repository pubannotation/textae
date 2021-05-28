import skipCharacters from '../editor/start/Presenter/EditMode/skipCharacters'

const getNow = function (str, position) {
  return str.charAt(position)
}
const skipForwardBlank = function (str, position, isBlankCharacter) {
  return skipCharacters(getNow, 1, str, position, isBlankCharacter)
}
const skipBackBlank = function (str, position, isBlankCharacter) {
  return skipCharacters(getNow, -1, str, position, isBlankCharacter)
}

export default {
  forward: skipForwardBlank,
  back: skipBackBlank
}

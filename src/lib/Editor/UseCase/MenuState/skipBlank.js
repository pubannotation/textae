import skipCharacters from './skipCharacters'

const getNow = (str, position) => str.charAt(position)
const skipForwardBlank = (str, position, isBlankCharacter) =>
  skipCharacters(getNow, 1, str, position, isBlankCharacter)
const skipBackBlank = (str, position, isBlankCharacter) =>
  skipCharacters(getNow, -1, str, position, isBlankCharacter)

export default {
  forward: skipForwardBlank,
  back: skipBackBlank
}

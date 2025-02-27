import alertifyjs from 'alertifyjs'
import decodeEscapeSequences from '../../decodeEscapeSequences'

export default function validateCharacter(char, currentCharacters) {
  if (currentCharacters.includes(char)) {
    alertifyjs.warning(`${char} is already added.`)
    return false
  }

  if (decodeEscapeSequences(char).length > 1) {
    alertifyjs.warning('Only one character is allowed.')
    return false
  }

  return true
}

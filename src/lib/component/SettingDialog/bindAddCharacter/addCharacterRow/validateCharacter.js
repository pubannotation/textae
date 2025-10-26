import alertifyjs from 'alertifyjs'

import EscapeSequence from '../../EscapeSequence'

export default function validateCharacter(char, currentCharacters) {
  if (currentCharacters.includes(char)) {
    alertifyjs.warning(`${char} is already added.`)
    return false
  }

  if (EscapeSequence.decode(char).length > 1) {
    alertifyjs.warning('Only one character is allowed.')
    return false
  }

  return true
}

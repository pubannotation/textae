import alertifyjs from 'alertifyjs'

export default function validateCharacter(char, currentCharacters) {
  if (currentCharacters.includes(char)) {
    alertifyjs.warning(`${char} is already added.`)
    return false
  }

  const decodedChar = char.replace(/\\n/g, '\n')
  if (decodedChar.length > 1) {
    alertifyjs.warning('Only one character is allowed.')
    return false
  }

  return true
}

export default function validateCharacter(char, currentCharacters) {
  if (currentCharacters.includes(char)) {
    return `${char} is already added.`
  }

  const decodedChar = char.replace(/\\n/g, '\n')
  if (decodedChar.length > 1) {
    return `Only one character is allowed.`
  }

  return null
}

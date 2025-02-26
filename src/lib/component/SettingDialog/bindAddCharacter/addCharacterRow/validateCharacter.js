export default function validateCharacter(content, type, char) {
  const currentCharacters = Array.from(
    content.querySelectorAll(
      `.textae-editor__setting-dialog__${type}-character-input`
    )
  ).map((input) => input.value)

  if (currentCharacters.includes(char)) {
    return `${char} is already added.`
  }

  const decodedChar = char.replace(/\\n/g, '\n')
  if (decodedChar.length > 1) {
    return `Only one character is allowed.`
  }

  return null
}

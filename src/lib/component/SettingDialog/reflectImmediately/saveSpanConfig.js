import alertifyjs from 'alertifyjs'

export default function saveSpanConfig(spanConfig, char, type) {
  if (!char) return false

  const unEscapedChar = char.replace(/\\n/g, '\n')

  const currentCharacters = () => {
    if (type === 'delimiter') {
      return spanConfig.delimiterCharacters
    } else if (type === 'blank') {
      return spanConfig.blankCharacters
    }
  }

  if (currentCharacters().includes(unEscapedChar)) {
    alertifyjs.warning(`${char} is already saved.`)
    return false
  }

  if (type === 'delimiter') {
    spanConfig.addDelimiterCharacter(unEscapedChar)
  } else if (type === 'blank') {
    spanConfig.addBlankCharacter(unEscapedChar)
  }

  return true
}

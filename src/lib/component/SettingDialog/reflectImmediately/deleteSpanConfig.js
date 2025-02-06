export default function deleteSpanConfig(spanConfig, char, type) {
  const unEscapedChar = char.replace(/\\n/g, '\n')

  if (type === 'delimiter') {
    spanConfig.deleteDelimiterCharacter(unEscapedChar)
  } else if (type === 'blank') {
    spanConfig.deleteBlankCharacter(unEscapedChar)
  }
}

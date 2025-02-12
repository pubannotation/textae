import validateConfiguration from './validateConfiguration'

export default function saveSpanConfig(content, spanConfig) {
  const delimiterInputs = content.querySelectorAll(
    '.textae-editor__setting-dialog__delimiter-character-input'
  )
  // Using replace to decode \n.
  // Using reverse to store the added value at the end of the array.
  const newDelimiterCharacters = Array.from(delimiterInputs)
    .map((input) => input.value.replace(/\\n/g, '\n'))
    .reverse()

  const blankInputs = content.querySelectorAll(
    '.textae-editor__setting-dialog__blank-character-input'
  )
  const newBlankCharacters = Array.from(blankInputs)
    .map((input) => input.value.replace(/\\n/g, '\n'))
    .reverse()

  const newSpanConfig = {
    'delimiter characters': Array.from(newDelimiterCharacters),
    'non-edge characters': Array.from(newBlankCharacters)
  }

  validateConfiguration(newSpanConfig)
  spanConfig.set(newSpanConfig)
}

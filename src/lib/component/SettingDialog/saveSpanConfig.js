export default function saveSpanConfig(content, spanConfig) {
  const delimiterInputs = content.querySelectorAll(
    '.textae-editor__setting-dialog__delimiter-character-input'
  )
  // Using reverse to store the added value at the end of the array.
  const newDelimiterCharacters = Array.from(delimiterInputs)
    .map((input) => input.value)
    .reverse()

  const blankInputs = content.querySelectorAll(
    '.textae-editor__setting-dialog__blank-character-input'
  )
  // Using reverse to store the added value at the end of the array.
  const newBlankCharacters = Array.from(blankInputs)
    .map((input) => input.value)
    .reverse()

  // Save spanConfig without duplicates.
  spanConfig.set({
    'delimiter characters': Array.from(new Set(newDelimiterCharacters)),
    'non-edge characters': Array.from(new Set(newBlankCharacters))
  })
}

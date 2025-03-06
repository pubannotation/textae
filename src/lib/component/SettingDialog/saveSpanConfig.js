import EscapeSequence from './EscapeSequence'
import validateConfiguration from './validateConfiguration'

export default function saveSpanConfig(content, spanConfig) {
  const delimiterInputs = content.querySelectorAll(
    '.textae-editor__setting-dialog__delimiter-character'
  )
  // Using reverse to store the added value at the end of the array.
  const newDelimiterCharacters = Array.from(delimiterInputs)
    .map((span) => EscapeSequence.decode(span.textContent))
    .reverse()

  const blankInputs = content.querySelectorAll(
    '.textae-editor__setting-dialog__blank-character'
  )
  const newBlankCharacters = Array.from(blankInputs)
    .map((span) => EscapeSequence.decode(span.textContent))
    .reverse()

  const newSpanConfig = {
    'delimiter characters': Array.from(newDelimiterCharacters),
    'non-edge characters': Array.from(newBlankCharacters)
  }

  validateConfiguration(newSpanConfig)
  spanConfig.set(newSpanConfig)
}

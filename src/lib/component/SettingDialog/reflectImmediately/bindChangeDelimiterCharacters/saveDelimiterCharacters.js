import unique from '../unique'

export default function saveDelimiterCharacters(content, spanConfig) {
  const newCharacters = [
    ...content.querySelectorAll(
      '.textae-editor__setting-dialog__delimiter-character-input'
    )
  ].map((input) => input.value)
  const currentConfig = {
    'delimiter characters': unique(newCharacters),
    'non-edge characters': spanConfig.blankCharacters // Preserve existing blank characters
  }

  spanConfig.set(currentConfig)
}

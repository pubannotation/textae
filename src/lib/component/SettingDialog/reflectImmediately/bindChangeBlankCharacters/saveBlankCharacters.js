import unique from '../unique'

export default function saveBlankCharacters(content, spanConfig) {
  const newCharacters = [
    ...content.querySelectorAll(
      '.textae-editor__setting-dialog__blank-character-input'
    )
  ].map((input) => input.value)
  const currentConfig = {
    'delimiter characters': spanConfig.delimiterCharacters, // Preserve existing delimiter characters
    'non-edge characters': unique(newCharacters)
  }

  spanConfig.set(currentConfig)
}

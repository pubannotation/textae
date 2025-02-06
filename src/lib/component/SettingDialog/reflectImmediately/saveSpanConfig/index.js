import unique from './unique'

export default function saveSpanConfig(content, spanConfig, type) {
  const newCharacters = [
    ...content.querySelectorAll(
      `.textae-editor__setting-dialog__${type}-character-input`
    )
  ].map((input) => input.value)

  const currentConfig = {
    'delimiter characters':
      type === 'delimiter'
        ? unique(newCharacters)
        : spanConfig.delimiterCharacters,
    'non-edge characters':
      type === 'blank' ? unique(newCharacters) : spanConfig.blankCharacters
  }

  spanConfig.set(currentConfig)
}

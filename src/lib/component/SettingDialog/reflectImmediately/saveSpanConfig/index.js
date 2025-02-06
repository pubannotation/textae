import unique from './unique'

export default function saveSpanConfig(content, spanConfig, type) {
  const newCharacters = [
    ...content.querySelectorAll(
      `.textae-editor__setting-dialog__${type}-character-input`
    )
  ].map((input) => input.value)

  const currentConfig = {
    'delimiter characters': spanConfig.delimiterCharacters,
    'non-edge characters': spanConfig.blankCharacters
  }

  if (type === 'delimiter') {
    currentConfig['delimiter characters'] = unique(newCharacters)
  } else if (type === 'blank') {
    currentConfig['non-edge characters'] = unique(newCharacters)
  }

  spanConfig.set(currentConfig)
}

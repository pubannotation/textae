import delegate from 'delegate'
import debounce300 from '../debounce300'
import saveDelimiterCharacters from './saveDelimiterCharacters'
import addDelimiterCharacter from './addDelimiterCharacter'

export default function bindChangeDelimiterCharacters(content, spanConfig) {
  // Save when existing character edited.
  delegate(
    content,
    '.textae-editor__setting-dialog__delimiter-character-input',
    'input',
    debounce300(() => saveDelimiterCharacters(content, spanConfig))
  )

  // Add character when "+" button click.
  delegate(
    content,
    '.textae-editor__setting-dialog__delimiter-character-add',
    'click',
    ({ target }) => {
      addDelimiterCharacter(target)
      saveDelimiterCharacters(content, spanConfig)
    }
  )

  // Delete character when "x" button click.
  delegate(
    content,
    '.textae-editor__setting-dialog__delimiter-character-delete',
    'click',
    ({ target }) => {
      target.closest('tr').remove()
      saveDelimiterCharacters(content, spanConfig)
    }
  )
}

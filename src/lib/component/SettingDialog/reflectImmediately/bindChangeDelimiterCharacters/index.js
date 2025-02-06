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
    debounce300(({ target }) => {
      const table = target.closest('table')
      saveDelimiterCharacters(spanConfig, table)
    })
  )

  // Add character when "+" button click.
  delegate(
    content,
    '.textae-editor__setting-dialog__delimiter-character-add',
    'click',
    ({ target }) => {
      const table = target.closest('table')
      addDelimiterCharacter(target)
      saveDelimiterCharacters(spanConfig, table)
    }
  )

  // Delete character when "x" button click.
  delegate(
    content,
    '.textae-editor__setting-dialog__delimiter-character-delete',
    'click',
    ({ target }) => {
      const table = target.closest('table')
      target.closest('tr').remove()
      saveDelimiterCharacters(spanConfig, table)
    }
  )
}

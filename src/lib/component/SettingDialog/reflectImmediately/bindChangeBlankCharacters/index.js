import delegate from 'delegate'
import debounce300 from '../debounce300'
import saveBlankCharacters from './saveBlankCharacters'
import addBlankCharacter from './addBlankCharacter'

export default function bindChangeBlankCharacters(content, spanConfig) {
  // Save when existing character edited.
  delegate(
    content,
    '.textae-editor__setting-dialog__blank-character-input',
    'input',
    debounce300(({ target }) => {
      const table = target.closest('table')
      saveBlankCharacters(spanConfig, target)
    })
  )

  // Add character when "+" button click.
  delegate(
    content,
    '.textae-editor__setting-dialog__blank-character-add',
    'click',
    ({ target }) => {
      const table = target.closest('table')
      addBlankCharacter(target)
      saveBlankCharacters(spanConfig, table)
    }
  )

  // Delete character when "x" button click.
  delegate(
    content,
    '.textae-editor__setting-dialog__blank-character-delete',
    'click',
    ({ target }) => {
      const table = target.closest('table')
      target.closest('tr').remove()
      saveBlankCharacters(spanConfig, table)
    }
  )
}

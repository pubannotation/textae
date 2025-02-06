import delegate from 'delegate'
import saveSpanConfig from './saveSpanConfig'
import addCharacterRow from './addCharacterRow'
import deleteSpanConfig from './deleteSpanConfig'

export default function bindChangeDelimiterCharacters(content, spanConfig) {
  // Save when existing character edited.
  delegate(
    content,
    '.textae-editor__setting-dialog__delimiter-character-input',
    'change',
    ({ target }) => {
      const inputValue = target.value
      saveSpanConfig(spanConfig, inputValue, 'delimiter')
    }
  )

  // Add character when "+" button click.
  delegate(
    content,
    '.textae-editor__setting-dialog__delimiter-character-add',
    'click',
    ({ target }) => {
      const inputValue =
        target.parentElement.previousElementSibling.querySelector('input').value
      const isSaved = saveSpanConfig(spanConfig, inputValue, 'delimiter')

      if (isSaved) {
        addCharacterRow(target, 'delimiter')
      }
    }
  )

  // Delete character when "x" button click.
  delegate(
    content,
    '.textae-editor__setting-dialog__delimiter-character-delete',
    'click',
    ({ target }) => {
      const inputValue =
        target.parentElement.previousElementSibling.querySelector('input').value
      deleteSpanConfig(spanConfig, inputValue, 'delimiter')

      // Delete element.
      target.closest('tr').remove()
    }
  )
}

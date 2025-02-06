import delegate from 'delegate'
import saveSpanConfig from './saveSpanConfig'
import addCharacterRow from './addCharacterRow'
import deleteSpanConfig from './deleteSpanConfig'

export default function bindChangeBlankCharacters(content, spanConfig) {
  // Save when existing character edited.
  delegate(
    content,
    '.textae-editor__setting-dialog__blank-character-input',
    'change',
    ({ target }) => {
      const inputValue = target.value
      saveSpanConfig(spanConfig, inputValue, 'blank')
    }
  )

  // Add character when "+" button click.
  delegate(
    content,
    '.textae-editor__setting-dialog__blank-character-add',
    'click',
    ({ target }) => {
      const inputValue =
        target.parentElement.previousElementSibling.querySelector('input').value
      const isSaved = saveSpanConfig(spanConfig, inputValue, 'blank')

      if (isSaved) {
        addCharacterRow(target, 'blank')
      }
    }
  )

  // Delete character when "x" button click.
  delegate(
    content,
    '.textae-editor__setting-dialog__blank-character-delete',
    'click',
    ({ target }) => {
      const inputValue =
        target.parentElement.previousElementSibling.querySelector('input').value
      deleteSpanConfig(spanConfig, inputValue, 'blank')

      // Delete element.
      target.closest('tr').remove()
    }
  )
}

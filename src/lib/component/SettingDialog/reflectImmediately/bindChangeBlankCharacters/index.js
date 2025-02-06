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
    debounce300(() => saveBlankCharacters(content, spanConfig))
  )

  // Add character when "+" button click.
  delegate(
    content,
    '.textae-editor__setting-dialog__blank-character-add',
    'click',
    ({ target }) => {
      addBlankCharacter(target)
      saveBlankCharacters(content, spanConfig)
    }
  )

  // Delete character when "x" button click.
  delegate(
    content,
    '.textae-editor__setting-dialog__blank-character-delete',
    'click',
    ({ target }) => {
      target.closest('tr').remove()
      saveBlankCharacters(content, spanConfig)
    }
  )
}

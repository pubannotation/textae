import delegate from 'delegate'
import debounce300 from './debounce300'
import addSpanConfig from './addSpanConfig'
import saveSpanConfig from './saveSpanConfig'

export default function bindChangeBlankCharacters(content, spanConfig) {
  // Save when existing character edited.
  delegate(
    content,
    '.textae-editor__setting-dialog__blank-character-input',
    'change',
    debounce300(() => saveSpanConfig(content, spanConfig, 'blank'))
  )

  // Add character when "+" button click.
  delegate(
    content,
    '.textae-editor__setting-dialog__blank-character-add',
    'click',
    ({ target }) => {
      addSpanConfig(target, 'blank')
      saveSpanConfig(content, spanConfig, 'blank')
    }
  )

  // Delete character when "x" button click.
  delegate(
    content,
    '.textae-editor__setting-dialog__blank-character-delete',
    'click',
    ({ target }) => {
      target.closest('tr').remove()
      saveSpanConfig(content, spanConfig, 'blank')
    }
  )
}

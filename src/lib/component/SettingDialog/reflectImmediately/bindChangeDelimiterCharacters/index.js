import delegate from 'delegate'
import debounce300 from '../debounce300'
import addDelimiterCharacter from './addDelimiterCharacter'
import saveSpanConfig from '../saveSpanConfig'

export default function bindChangeDelimiterCharacters(content, spanConfig) {
  // Save when existing character edited.
  delegate(
    content,
    '.textae-editor__setting-dialog__delimiter-character-input',
    'input',
    debounce300(() => saveSpanConfig(content, spanConfig, 'delimiter'))
  )

  // Add character when "+" button click.
  delegate(
    content,
    '.textae-editor__setting-dialog__delimiter-character-add',
    'click',
    ({ target }) => {
      addDelimiterCharacter(target)
      saveSpanConfig(content, spanConfig, 'delimiter')
    }
  )

  // Delete character when "x" button click.
  delegate(
    content,
    '.textae-editor__setting-dialog__delimiter-character-delete',
    'click',
    ({ target }) => {
      target.closest('tr').remove()
      saveSpanConfig(content, spanConfig, 'delimiter')
    }
  )
}

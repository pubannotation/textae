import delegate from 'delegate'
import addCharacterRow from './addCharacterRow'

export default function bindAddCharacter(content) {
  delegate(
    content,
    '.textae-editor__setting-dialog__delimiter-character-add',
    'click',
    () => addCharacterRow(content, 'delimiter')
  )

  delegate(
    content,
    '.textae-editor__setting-dialog__blank-character-add',
    'click',
    () => addCharacterRow(content, 'blank')
  )
}

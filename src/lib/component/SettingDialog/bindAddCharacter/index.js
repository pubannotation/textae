import delegate from 'delegate'

import addCharacterRow from './addCharacterRow'

export default function bindAddCharacter(content) {
  delegate(
    content,
    '.textae-editor__setting-dialog__delimiter-character-add-button',
    'click',
    () => addCharacterRow(content, 'delimiter')
  )

  delegate(
    content,
    '.textae-editor__setting-dialog__blank-character-add-button',
    'click',
    () => addCharacterRow(content, 'blank')
  )
}

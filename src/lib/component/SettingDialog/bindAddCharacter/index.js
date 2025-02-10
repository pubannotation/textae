import delegate from 'delegate'
import addCharacterRow from './addCharacterRow'

export default function bindAddCharacter(content) {
  delegate(
    content,
    '.textae-editor__setting-dialog__delimiter-character-add',
    'click',
    ({ target }) => {
      addCharacterRow(content, target, 'delimiter')
    }
  )

  delegate(
    content,
    '.textae-editor__setting-dialog__blank-character-add',
    'click',
    ({ target }) => {
      addCharacterRow(content, target, 'blank')
    }
  )
}

import delegate from 'delegate'

export default function bindDeleteCharacter(content) {
  delegate(
    content,
    '.textae-editor__setting-dialog__delimiter-character-delete',
    'click',
    ({ target }) => {
      target.closest('tr').remove()
    }
  )

  delegate(
    content,
    '.textae-editor__setting-dialog__blank-character-delete',
    'click',
    ({ target }) => {
      target.closest('tr').remove()
    }
  )
}

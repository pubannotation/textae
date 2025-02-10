import delegate from 'delegate'

export default function bindDeleteCharacter(content) {
  delegate(
    content,
    '.textae-editor__setting-dialog__delimiter-character-delete-button',
    'click',
    ({ target }) => {
      target
        .closest('.textae-editor__setting-dialog__delimiter-character-row')
        .remove()
    }
  )

  delegate(
    content,
    '.textae-editor__setting-dialog__blank-character-delete-button',
    'click',
    ({ target }) => {
      target
        .closest('.textae-editor__setting-dialog__blank-character-row')
        .remove()
    }
  )
}

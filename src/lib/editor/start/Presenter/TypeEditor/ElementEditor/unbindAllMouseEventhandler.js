export default function(editor) {
  return editor
      .off('mouseup', '.textae-editor__body')
      .off('mouseup', '.textae-editor__span')
      .off('mouseup', '.textae-editor__span_block')
      .off('mouseup', '.textae-editor__type-label')
      .off('mouseup', '.textae-editor__entity-pane')
      .off('mouseup', '.textae-editor__entity')
      .off('click', '.textae-editor__attribute-button--add')
      .off('click', '.textae-editor__attribute-button--edit')
      .off('click', '.textae-editor__attribute-button--delete')
}

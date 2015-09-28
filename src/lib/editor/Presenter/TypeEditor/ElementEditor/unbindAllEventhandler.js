export default function(editor) {
  return editor
      .off('mouseup', '.textae-editor__body')
      .off('mouseup', '.textae-editor__span')
      .off('mouseup', '.textae-editor__span_block')
      .off('mouseup', '.textae-editor__type-label')
      .off('mouseup', '.textae-editor__entity-pane')
      .off('mouseup', '.textae-editor__entity')
}

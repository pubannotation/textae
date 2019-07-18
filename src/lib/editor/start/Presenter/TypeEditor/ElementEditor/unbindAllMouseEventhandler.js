export default function(editor) {
  // For support context menu.
  // Mouse up event occurs when either left or right button is clicked.
  // Change mouse events to monitor from mouseup to click since v5.0.0.
  editor
    .off('click', '.textae-editor__body')
    .off('click', '.textae-editor__span_block')
    .off('click', '.textae-editor__type-label')
    .off('click', '.textae-editor__entity')
    .off('click', '.textae-editor__attribute-button--edit')
    .off('click', '.textae-editor__attribute-button--delete')

  editor
    .off('mouseup', '.textae-editor__span')
}

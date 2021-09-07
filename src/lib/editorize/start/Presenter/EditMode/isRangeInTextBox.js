export default function (selection, editor) {
  return (
    selection.type === 'Range' &&
    editor[0]
      .querySelector('.textae-editor__text-box')
      .contains(selection.anchorNode) &&
    editor[0]
      .querySelector('.textae-editor__text-box')
      .contains(selection.focusNode)
  )
}

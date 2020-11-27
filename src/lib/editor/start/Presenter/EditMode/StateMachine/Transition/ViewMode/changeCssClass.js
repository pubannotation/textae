export default function (editor, mode) {
  editor
    .removeClass('textae-editor__mode--denotation-without-relation')
    .removeClass('textae-editor__mode--denotation-with-relation')
    .removeClass('textae-editor__mode--block-with-relation')
    .removeClass('textae-editor__mode--relation')
    .addClass(`textae-editor__mode--${mode}`)
}

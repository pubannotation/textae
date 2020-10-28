export default function(editor, mode) {
  editor
    .removeClass('textae-editor--term-mode')
    .removeClass('textae-editor--instance-mode')
    .removeClass('textae-editor--block-mode')
    .removeClass('textae-editor--relation-mode')
    .addClass(`textae-editor--${mode}-mode`)
}

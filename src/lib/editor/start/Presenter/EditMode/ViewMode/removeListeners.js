export default function(editor, entitySelectChanged) {
  editor.eventEmitter
    .removeListener('textae.selection.entity.select', entitySelectChanged)
    .removeListener('textae.selection.entity.deselect', entitySelectChanged)
}

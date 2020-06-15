export default function(editor, modifier) {
  editor.eventEmitter
    .on('textae.selection.span.select', modifier.span.select)
    .on('textae.selection.span.deselect', modifier.span.deselect)
    .on('textae.selection.entity.select', modifier.entity.select)
    .on('textae.selection.entity.deselect', modifier.entity.deselect)
    .on('textae.viewMode.entity.selectChange', (id) => {
      // We only want to highlight labels when in Entity edit mode,
      // so we monitor ViewModel events instead of SelectionModel events.
      modifier.entityLabel.update(id)
    })
    .on('textae.selection.relation.select', (id) =>
      setTimeout(() => modifier.relation.select(id), 150)
    )
    .on('textae.selection.relation.deselect', (id) =>
      setTimeout(() => modifier.relation.deselect(id), 150)
    )
}

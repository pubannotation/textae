export default function(editor, modifier) {
  editor.eventEmitter
    .on('textae.selection.span.select', (id) => modifier.span.select(id))
    .on('textae.selection.span.deselect', (id) => modifier.span.deselect(id))
    .on('textae.selection.entity.select', (id) => modifier.entity.select(id))
    .on('textae.selection.entity.deselect', (id) =>
      modifier.entity.deselect(id)
    )
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

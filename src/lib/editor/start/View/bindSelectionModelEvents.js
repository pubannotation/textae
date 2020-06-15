export default function(editor, selector) {
  editor.eventEmitter
    .on('textae.selection.span.select', selector.span.select)
    .on('textae.selection.span.deselect', selector.span.deselect)
    .on('textae.selection.entity.select', selector.entity.select)
    .on('textae.selection.entity.deselect', selector.entity.deselect)
    .on('textae.viewMode.entity.selectChange', (id) => {
      // We only want to highlight labels when in Entity edit mode,
      // so we monitor ViewModel events instead of SelectionModel events.
      selector.entityLabel.update(id)
    })
    .on('textae.selection.relation.select', (id) =>
      setTimeout(() => selector.relation.select(id), 150)
    )
    .on('textae.selection.relation.deselect', (id) =>
      setTimeout(() => selector.relation.deselect(id), 150)
    )
}

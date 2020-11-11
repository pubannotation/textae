import EntityHTMLelementSelector from './EntityHTMLelementSelector'

export default function (editor) {
  const entityHtmlelementSelector = new EntityHTMLelementSelector(editor)

  editor.eventEmitter
    .on('textae.selection.span.select', (span) => span.select())
    .on('textae.selection.span.deselect', (span) => span.deselect())
    .on('textae.selection.entity.select', (entity) =>
      entityHtmlelementSelector.select(entity.id)
    )
    .on('textae.selection.entity.deselect', (entity) =>
      entityHtmlelementSelector.deselect(entity.id)
    )
    .on('textae.selection.relation.select', (relation) =>
      setTimeout(() => relation.selectJsPlumbConnection(), 150)
    )
    .on('textae.selection.relation.deselect', (relation) =>
      setTimeout(() => relation.deselectJsPlumbConnection(), 150)
    )
}

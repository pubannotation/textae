export default function (editor) {
  editor.eventEmitter
    .on('textae.selection.span.select', (span) => span.select())
    .on('textae.selection.span.deselect', (span) => span.deselect())
    .on('textae.selection.entity.select', (entity) => entity.select())
    .on('textae.selection.entity.deselect', (entity) => entity.deselect())
    .on('textae.selection.relation.select', (relation) => relation.select())
    .on('textae.selection.relation.deselect', (relation) => relation.deselect())
}

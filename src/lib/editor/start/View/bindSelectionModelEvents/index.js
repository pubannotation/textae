import SpanHtmlelementSelector from './SpanHtmlelementSelector'
import EntityHtmlelementSelector from '../EntityHtmlelementSelector'

export default function (editor) {
  const spanHtmlelementSelector = new SpanHtmlelementSelector()
  const entityHtmlelementSelector = new EntityHtmlelementSelector(editor)

  editor.eventEmitter
    .on('textae.selection.span.select', (span) =>
      spanHtmlelementSelector.select(span)
    )
    .on('textae.selection.span.deselect', (span) =>
      spanHtmlelementSelector.deselect(span)
    )
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

import SpanDomSelector from './SpanDomSelector'
import EntityDomSelector from '../EntityDomSelector'

export default function(editor) {
  const spanDomSelector = new SpanDomSelector()
  const entityDomSelector = new EntityDomSelector(editor)

  editor.eventEmitter
    .on('textae.selection.span.select', (span) => spanDomSelector.select(span))
    .on('textae.selection.span.deselect', (span) =>
      spanDomSelector.deselect(span)
    )
    .on('textae.selection.entity.select', (entity) =>
      entityDomSelector.select(entity.id)
    )
    .on('textae.selection.entity.deselect', (entity) =>
      entityDomSelector.deselect(entity.id)
    )
    .on('textae.selection.relation.select', (relation) =>
      setTimeout(() => {
        if (relation.connect) relation.connect.select()
      }, 150)
    )
    .on('textae.selection.relation.deselect', (relation) =>
      setTimeout(() => {
        if (relation.connect) relation.connect.deselect()
      }, 150)
    )
}

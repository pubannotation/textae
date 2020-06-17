import SpanDomSelector from './SpanDomSelector'
import EntityDomSelector from '../EntityDomSelector'
import RelationDomSelector from './RelationDomSelector'

export default function(editor, annotationData) {
  const spanDomSelector = new SpanDomSelector()
  const entityDomSelector = new EntityDomSelector(editor)
  const relationDomSelector = new RelationDomSelector(editor, annotationData)

  editor.eventEmitter
    .on('textae.selection.span.select', (id) => spanDomSelector.select(id))
    .on('textae.selection.span.deselect', (id) => spanDomSelector.deselect(id))
    .on('textae.selection.entity.select', (id) => entityDomSelector.select(id))
    .on('textae.selection.entity.deselect', (id) =>
      entityDomSelector.deselect(id)
    )
    .on('textae.viewMode.entity.selectChange', (id) => {
      // We only want to highlight labels when in Entity edit mode,
      // so we monitor ViewModel events instead of SelectionModel events.
      entityDomSelector.updateLabel(id)
    })
    .on('textae.selection.relation.select', (id) =>
      setTimeout(() => relationDomSelector.select(id), 150)
    )
    .on('textae.selection.relation.deselect', (id) =>
      setTimeout(() => relationDomSelector.deselect(id), 150)
    )
}

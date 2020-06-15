import SpanModifier from './SpanModifier'
import EntityModifier from '../EntityModifier'
import RelationModifier from './RelationModifier'

export default function(editor, annotationData) {
  const spanModifier = new SpanModifier()
  const entityModfier = new EntityModifier(editor)
  const relationModifier = new RelationModifier(editor, annotationData)

  editor.eventEmitter
    .on('textae.selection.span.select', (id) => spanModifier.select(id))
    .on('textae.selection.span.deselect', (id) => spanModifier.deselect(id))
    .on('textae.selection.entity.select', (id) => entityModfier.select(id))
    .on('textae.selection.entity.deselect', (id) => entityModfier.deselect(id))
    .on('textae.viewMode.entity.selectChange', (id) => {
      // We only want to highlight labels when in Entity edit mode,
      // so we monitor ViewModel events instead of SelectionModel events.
      entityModfier.updateLabel(id)
    })
    .on('textae.selection.relation.select', (id) =>
      setTimeout(() => relationModifier.select(id), 150)
    )
    .on('textae.selection.relation.deselect', (id) =>
      setTimeout(() => relationModifier.deselect(id), 150)
    )
}

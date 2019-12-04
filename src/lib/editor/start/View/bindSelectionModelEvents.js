import Selector from '../Selector'

export default function(editor, selector, buttonStateHelper) {
  // Because entity.change is off at relation-edit-mode.
  editor.eventEmitter
    .on('textae.selection.span.select', selector.span.select)
    .on('textae.selection.span.deselect', selector.span.deselect)
    .on('textae.selection.span.change', () => buttonStateHelper.updateBySpan())
    .on('textae.selection.entity.select', selector.entity.select)
    .on('textae.selection.entity.deselect', selector.entity.deselect)
    .on('textae.selection.attribute.select', selector.attribute.select)
    .on('textae.selection.attribute.deselect', selector.attribute.deselect)
    .on('textae.selection.relation.select', (id) =>
      setTimeout(() => selector.relation.select(id), 150)
    )
    .on('textae.selection.relation.deselect', (id) =>
      setTimeout(() => selector.relation.deselect(id), 150)
    )
    .on('textae.selection.relation.change', () =>
      buttonStateHelper.updateByRelation()
    )
}

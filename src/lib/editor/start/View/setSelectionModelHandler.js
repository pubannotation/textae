import Selector from '../Selector'

export default function(
  editor,
  annotationData,
  selectionModel,
  buttonController
) {
  const selector = new Selector(editor, annotationData)

  // Because entity.change is off at relation-edit-mode.
  selectionModel
    .on('span.select', selector.span.select)
    .on('span.deselect', selector.span.deselect)
    .on('span.change', () => buttonController.buttonStateHelper.updateBySpan())
    .on('entity.select', selector.entity.select)
    .on('entity.deselect', selector.entity.deselect)
    .on('attribute.select', selector.attribute.select)
    .on('attribute.deselect', selector.attribute.deselect)
    .on('relation.select', (id) =>
      setTimeout(() => selector.relation.select(id), 150)
    )
    .on('relation.deselect', (id) =>
      setTimeout(() => selector.relation.deselect(id), 150)
    )
    .on('relation.change', () =>
      buttonController.buttonStateHelper.updateByRelation()
    )
}

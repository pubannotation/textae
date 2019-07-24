import renderModification from './renderModification'
import bindeToModelEvent from './bindeToModelEvent'
import createEventMap from './createEventMap'

export default function(
  emitter,
  domPositionCache,
  entityRenderer,
  relationRenderer,
  editor,
  spanRenderer,
  gridRenderer,
  buttonStateHelper,
  annotationData
) {
  const changeSpanOfEntity = (entity) => {
    // Change css class of the span according to the type is block or not.
    const span = annotationData.span.get(entity.span)
    return spanRenderer.change(span)
  }

  const renderModificationEntityOrRelation = (modification) => {
    renderModification(
      annotationData,
      'relation',
      modification,
      relationRenderer,
      buttonStateHelper
    )
    renderModification(
      annotationData,
      'entity',
      modification,
      entityRenderer,
      buttonStateHelper
    )
  }

  const eventMap = createEventMap(
    domPositionCache,
    entityRenderer,
    relationRenderer,
    editor,
    spanRenderer,
    gridRenderer,
    changeSpanOfEntity,
    renderModificationEntityOrRelation
  )

  for (const [event, handler] of eventMap) {
    bindeToModelEvent(emitter, annotationData, event, handler)
  }
}

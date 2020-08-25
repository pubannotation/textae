import doesSpanHasNoEntity from './doesSpanHasNoEntity'
import getEntityDom from '../../getEntityDom'

export default function(annotationData, gridRenderer, entity) {
  if (doesSpanHasNoEntity(annotationData, entity.span)) {
    // Destroy a grid when all entities are remove.
    gridRenderer.remove(entity.span)
  } else {
    // Destroy whole of type DOM.
    getEntityDom(entity).remove()
  }
}

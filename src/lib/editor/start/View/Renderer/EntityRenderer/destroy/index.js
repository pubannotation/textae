import doesSpanHasNoEntity from './doesSpanHasNoEntity'
import getTypeDom from '../../getTypeDom'

export default function(annotationData, gridRenderer, entity) {
  if (doesSpanHasNoEntity(annotationData, entity.span)) {
    // Destroy a grid when all entities are remove.
    gridRenderer.remove(entity.span)
  } else {
    // Destroy whole of type DOM.
    getTypeDom(entity).remove()
  }
}

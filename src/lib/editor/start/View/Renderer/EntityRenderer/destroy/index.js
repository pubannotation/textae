import removeEntityElement from '../removeEntityElement'
import updateAncestorsElement from '../updateAncestorsElement'
import doesSpanHasNoEntity from './doesSpanHasNoEntity'

export default function(editor, annotationData, gridRenderer, entity) {
  if (doesSpanHasNoEntity(annotationData, entity.span)) {
    // Destroy a grid when all entities are remove.
    gridRenderer.remove(entity.span)
  } else {
    // Destroy an each entity.
    const paneElement = removeEntityElement(editor, entity.id)
    updateAncestorsElement(paneElement)
  }
}

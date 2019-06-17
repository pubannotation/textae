import removeEntityElement from './removeEntityElement'
import removeNoEntityPaneElement from './removeNoEntityPaneElement'
import doesSpanHasNoEntity from './doesSpanHasNoEntity'

export default function destroy(editor, annotationData, gridRenderer, entity) {
  if (doesSpanHasNoEntity(annotationData, entity.span)) {
    // Destroy a grid when all entities are remove.
    gridRenderer.remove(entity.span)
  } else {
    // Destroy an each entity.
    const paneNode = removeEntityElement(editor, entity.id)
    removeNoEntityPaneElement(paneNode)
  }

  return entity
}

// Unique Entities. Because a entity is deplicate When a span and thats entity is selected.
export default function(clipBoard, selectionModel, annotationData) {
  clipBoard.clipBoard = [
    ...new Set(
      (function getEntitiesFromSelectedSpan() {
        return selectionModel.span
          .all()
          .map((spanId) => {
            return annotationData.span
              .get(spanId)
              .getEntities()
              .map((e) => e.id)
          })
          .flat()
      })().concat(selectionModel.entity.all())
    )
  ].map((entityId) => {
    // Map entities to types, because entities may be delete.
    return annotationData.entity.get(entityId).type
  })
}

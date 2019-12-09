import getSelectedSpansEntities from './getSelectedSpansEntities'

// Unique Entities. Because a entity is deplicate When a span and thats entity is selected.
export default function(clipBoard, selectionModel, annotationData) {
  clipBoard.clipBoard = [
    ...new Set(
      getSelectedSpansEntities(selectionModel, annotationData).concat(
        selectionModel.entity.all
      )
    )
  ].map(
    (entityId) => annotationData.entity.get(entityId).type // Map entities to types, because entities may be delete.
  )
}

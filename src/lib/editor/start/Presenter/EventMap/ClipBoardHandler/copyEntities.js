import getSelectedSpansEntities from './getSelectedSpansEntities'

// Unique Entities. Because a entity is deplicate When a span and thats entity is selected.
export default function(clipBoard, selectionModel) {
  clipBoard.clipBoard = [
    ...new Set(
      getSelectedSpansEntities(selectionModel).concat(selectionModel.entity.all)
    )
  ].map(
    (entity) => entity.type // Map entities to types, because entities may be delete.
  )
}

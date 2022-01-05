import getSelectedSpansEntities from '../start/Clipboard/getSelectedSpansEntities'

// Unique Entities. Because a entity is deplicate When a span and thats entity is selected.
export default function (selectionModel) {
  return new Set(
    getSelectedSpansEntities(selectionModel).concat(selectionModel.entity.all)
  )
}

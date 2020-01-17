import select from './select'
import deselect from './deselect'

export default function(selectionModel, ctrlKey, typeValues, entities) {
  if (ctrlKey) {
    if (typeValues.classList.contains('ui-selected')) {
      deselect(selectionModel, entities)
    } else {
      select(selectionModel, entities)
    }
  } else {
    selectionModel.clear()
    select(selectionModel, entities)
  }

  return false
}

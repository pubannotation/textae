export default function(selectionModel, ctrlKey, typeLabel, entities) {
  if (ctrlKey) {
    if (typeLabel.classList.contains('ui-selected')) {
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

// A parameter entities is a HTMLCollection. It does not have the forEach method.
function select(selectionModel, entities) {
  for (const entity of entities) {
    selectionModel.entity.add(entity.title)
  }
}

function deselect(selectionModel, entities) {
  for (const entity of entities) {
    selectionModel.entity.remove(entity.title)
  }
}

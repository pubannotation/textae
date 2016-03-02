export default function entityClickedAtRelationMode(selectionModel, command, typeContainer, e) {
  if (!selectionModel.entity.some()) {
    selectionModel.clear()
    selectionModel.entity.add($(e.target).attr('title'))
  } else {
    onSelectObjectEntity(selectionModel, command, typeContainer, e)
  }

  return false
}

function onSelectObjectEntity(selectionModel, command, typeContainer, e) {
  // Cannot make a self reference relation.
  const subjectEntityId = selectionModel.entity.all()[0],
    objectEntityId = $(e.target).attr('title')

  if (subjectEntityId === objectEntityId) {
    // Deslect already selected entity.
    selectionModel.entity.remove(subjectEntityId)
  } else {
    selectionModel.entity.add(objectEntityId)
    createRelation(command, subjectEntityId, objectEntityId, typeContainer)
    updateSelectionOfEntity(e, selectionModel.entity, subjectEntityId, objectEntityId)
  }
}

function createRelation(command, subjectEntityId, objectEntityId, typeContainer) {
  command.invoke([command.factory.relationCreateCommand({
    subj: subjectEntityId,
    obj: objectEntityId,
    type: typeContainer.relation.getDefaultType()
  })])
}

function updateSelectionOfEntity(event, selectionModel, subjectEntityId, objectEntityId) {
  if (event.ctrlKey || event.metaKey) {
    // Remaining selection of the subject entity.
    selectionModel.remove(objectEntityId)
  } else if (event.shiftKey) {
    selectionModel.remove(subjectEntityId)
    selectionModel.add(objectEntityId)
    return false
  } else {
    selectionModel.remove(subjectEntityId)
    selectionModel.remove(objectEntityId)
  }
}

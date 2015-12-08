import dismissBrowserSelection from '../../dismissBrowserSelection'

export default function entityClickedAtRelationMode(selectionModel, command, typeContainer, e) {
  if (!selectionModel.entity.some()) {
    selectionModel.clear()
    selectionModel.entity.add($(e.target).attr('title'))
  } else {
    selectObjectEntity(selectionModel, command, typeContainer, e)
  }
  return false
}

function selectObjectEntity(selectionModel, command, typeContainer, e) {
  // Cannot make a self reference relation.
  let subjectEntityId = selectionModel.entity.all()[0],
    objectEntityId = $(e.target).attr('title')

  if (subjectEntityId === objectEntityId) {
    // Deslect already selected entity.
    selectionModel.entity.remove(subjectEntityId)
  } else {
    selectionModel.entity.add(objectEntityId)
    _.defer(() => {
      command.invoke([command.factory.relationCreateCommand({
        subj: subjectEntityId,
        obj: objectEntityId,
        type: typeContainer.relation.getDefaultType()
      })])

      if (e.ctrlKey || e.metaKey) {
        // Remaining selection of the subject entity.
        selectionModel.entity.remove(objectEntityId)
      } else if (e.shiftKey) {
        dismissBrowserSelection()
        selectionModel.entity.remove(subjectEntityId)
        selectionModel.entity.add(objectEntityId)
        return false
      } else {
        selectionModel.entity.remove(subjectEntityId)
        selectionModel.entity.remove(objectEntityId)
      }
    })
  }
}

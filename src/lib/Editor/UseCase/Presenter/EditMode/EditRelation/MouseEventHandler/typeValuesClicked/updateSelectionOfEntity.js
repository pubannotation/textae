export default function (
  event,
  selectionModel,
  subjectEntityId,
  objectEntityId
) {
  if (event.ctrlKey || event.metaKey) {
    // Remaining selection of the subject entity.
    selectionModel.remove('entity', objectEntityId)
  } else if (event.shiftKey) {
    selectionModel.remove('entity', subjectEntityId)
    selectionModel.add('entity', [objectEntityId])
  } else {
    selectionModel.remove('entity', subjectEntityId)
    selectionModel.remove('entity', objectEntityId)
  }
}

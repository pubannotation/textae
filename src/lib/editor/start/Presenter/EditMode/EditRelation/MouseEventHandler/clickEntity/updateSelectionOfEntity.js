export default function (
  event,
  selectionModel,
  subjectEntityId,
  objectEntityId
) {
  if (event.ctrlKey || event.metaKey) {
    // Remaining selection of the subject entity.
    selectionModel.remove(objectEntityId)
  } else if (event.shiftKey) {
    selectionModel.remove(subjectEntityId)
    selectionModel.add(objectEntityId)
  } else {
    selectionModel.remove(subjectEntityId)
    selectionModel.remove(objectEntityId)
  }
}

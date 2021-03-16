import createRelation from './createRelation'
import updateSelectionOfEntity from './updateSelectionOfEntity'

export default function (
  selectionModel,
  entityId,
  commander,
  typeDefinition,
  event
) {
  if (!selectionModel.entity.some) {
    selectionModel.removeAll()
    selectionModel.entity.add(entityId)
  } else {
    const subjectEntityId = selectionModel.entity.singleId
    const objectEntityId = entityId

    // Cannot make a self reference relation.
    if (subjectEntityId === objectEntityId) {
      // Deslect already selected entity.
      selectionModel.entity.remove(subjectEntityId)
    } else {
      createRelation(commander, subjectEntityId, objectEntityId, typeDefinition)
      updateSelectionOfEntity(
        event,
        selectionModel.entity,
        subjectEntityId,
        objectEntityId
      )
    }
  }
}

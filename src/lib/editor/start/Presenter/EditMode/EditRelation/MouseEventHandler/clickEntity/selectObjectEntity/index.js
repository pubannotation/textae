import updateSelectionOfEntity from './updateSelectionOfEntity'
import createRelation from './createRelation'

export default function (
  selectionModel,
  commander,
  typeDefinition,
  event,
  entityId
) {
  // Cannot make a self reference relation.
  const subjectEntityId = selectionModel.entity.singleId
  const objectEntityId = entityId

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

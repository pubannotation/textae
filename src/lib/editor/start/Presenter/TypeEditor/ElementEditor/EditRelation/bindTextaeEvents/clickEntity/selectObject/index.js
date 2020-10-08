import updateSelectionOfEntity from './updateSelectionOfEntity'
import createRelation from './createRelation'

export default function(
  selectionModel,
  commander,
  typeDefinition,
  event,
  entity
) {
  // Cannot make a self reference relation.
  const subjectEntityId = selectionModel.entity.all[0].id
  const objectEntityId = entity.title

  if (subjectEntityId === objectEntityId) {
    // Deslect already selected entity.
    selectionModel.entity.remove(subjectEntityId)
  } else {
    // selectionModel.entity.add(objectEntityId)
    createRelation(commander, subjectEntityId, objectEntityId, typeDefinition)
    updateSelectionOfEntity(
      event,
      selectionModel.entity,
      subjectEntityId,
      objectEntityId
    )
  }
}

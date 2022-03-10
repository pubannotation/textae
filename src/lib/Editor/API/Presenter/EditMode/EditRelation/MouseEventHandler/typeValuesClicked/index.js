import getEntityHTMLelementFromChild from '../../../../../getEntityHTMLelementFromChild'
import updateSelectionOfEntity from './updateSelectionOfEntity'

export default function (
  selectionModel,
  commander,
  relationDefinitionContainer,
  event
) {
  const entityID = getEntityHTMLelementFromChild(event.target).dataset.id

  if (!selectionModel.entity.some) {
    selectionModel.selectEntity(entityID)
  } else {
    const subjectEntityId = selectionModel.entity.singleId
    const objectEntityId = entityID

    // Cannot make a self reference relation.
    if (subjectEntityId === objectEntityId) {
      selectionModel.entity.toggle(subjectEntityId)
    } else {
      commander.invoke(
        commander.factory.createRelationCommand({
          subj: subjectEntityId,
          obj: objectEntityId,
          pred: relationDefinitionContainer.defaultType
        })
      )

      updateSelectionOfEntity(
        event,
        selectionModel.entity,
        subjectEntityId,
        objectEntityId
      )
    }
  }
}

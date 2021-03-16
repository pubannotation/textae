import getEntityHTMLelementFromChild from '../../../../../getEntityHTMLelementFromChild'
import updateSelectionOfEntity from './updateSelectionOfEntity'

export default function (
  selectionModel,
  commander,
  relationDefinitionContainer,
  event
) {
  const entityId = getEntityHTMLelementFromChild(event.target).title

  if (!selectionModel.entity.some) {
    selectionModel.selectEntity(entityId)
  } else {
    const subjectEntityId = selectionModel.entity.singleId
    const objectEntityId = entityId

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

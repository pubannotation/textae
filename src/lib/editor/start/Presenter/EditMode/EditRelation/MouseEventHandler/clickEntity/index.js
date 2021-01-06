import selectObjectEntity from './selectObjectEntity'

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
    selectObjectEntity(
      selectionModel,
      commander,
      typeDefinition,
      event,
      entityId
    )
  }
}

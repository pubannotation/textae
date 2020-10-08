import selectObject from './selectObject'

export default function(
  selectionModel,
  entityId,
  commander,
  typeDefinition,
  event
) {
  if (!selectionModel.entity.some) {
    selectionModel.clear()
    selectionModel.entity.add(entityId)
  } else {
    selectObject(selectionModel, commander, typeDefinition, event, entityId)
  }
}

import selectObject from './selectObject'

export default function(
  selectionModel,
  entity,
  commander,
  typeDefinition,
  event
) {
  if (!selectionModel.entity.some) {
    selectionModel.clear()
    selectionModel.entity.add(entity.title)
  } else {
    selectObject(selectionModel, commander, typeDefinition, event, entity)
  }
}

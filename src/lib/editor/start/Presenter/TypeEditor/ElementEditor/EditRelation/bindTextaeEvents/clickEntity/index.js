import selectObject from './selectObject'

export default function(selectionModel, entity, commander, typeDefinition, e) {
  if (!selectionModel.entity.some) {
    selectionModel.clear()
    selectionModel.entity.add(entity.title)
  } else {
    selectObject(selectionModel, commander, typeDefinition, e, entity)
  }
}

import onSelectObjectEntity from './onSelectObjectEntity'

export default function entityClickedAtRelationMode(
  selectionModel,
  commander,
  typeDefinition,
  e
) {
  if (!selectionModel.entity.some) {
    selectionModel.clear()
    selectionModel.entity.add(e.target.getAttribute('title'))
  } else {
    onSelectObjectEntity(selectionModel, commander, typeDefinition, e)
  }

  return false
}

import { RemoveCommand } from './commandTemplate'
import executeCompositCommand from './executeCompositCommand'
import findAttribute from './findAttribute'

export default function(
  editor,
  annotationData,
  selectionModel,
  selectedEntities,
  pred,
  obj
) {
  const subCommands = []

  for (const id of selectedEntities) {
    const attribute = findAttribute(annotationData, id, pred, obj)
    subCommands.push(
      new RemoveCommand(
        editor,
        annotationData,
        selectionModel,
        'attribute',
        attribute.id
      )
    )
  }

  return {
    execute() {
      executeCompositCommand(
        'attributes',
        this,
        'remove',
        `remove attribute {pred: ${pred}, obj: ${obj}} from ${selectedEntities}`,
        subCommands
      )
    }
  }
}

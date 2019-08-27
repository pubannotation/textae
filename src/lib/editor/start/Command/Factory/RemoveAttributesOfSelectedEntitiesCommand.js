import { RemoveCommand } from './commandTemplate'
import findAttribute from './findAttribute'
import CompositeCommand from './CompositeCommand'

export default class extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    selectedEntities,
    pred,
    obj
  ) {
    super()

    this.subCommands = []
    this.pred = pred
    this.obj = obj
    this.selectedEntities = selectedEntities

    for (const id of selectedEntities) {
      const attribute = findAttribute(annotationData, id, pred, obj)

      // If you select an entity with attributes and an entity without attributes,
      // the attributes may not be found.
      if (attribute) {
        this.subCommands.push(
          new RemoveCommand(
            editor,
            annotationData,
            selectionModel,
            'attribute',
            attribute.id
          )
        )
      }
    }

    this._logMessage = `remove an attribute {pred: ${this.pred}, obj: ${this.obj}} from ${this.selectedEntities}`
  }
}

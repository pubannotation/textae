import findAttribute from './findAttribute'
import CompositeCommand from './CompositeCommand'
import getRemoveAtributesByPredAndObjCommands from './getRemoveAtributesByPredAndObjCommands'

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

    this.pred = pred
    this.obj = obj
    this.selectedEntities = selectedEntities

    // If you select an entity with attributes and an entity without attributes,
    // the attributes may not be found.
    const attributes = selectedEntities
      .map((id) => findAttribute(annotationData, id, pred, obj))
      .filter((attr) => attr)

    const removeAttributeCommands = getRemoveAtributesByPredAndObjCommands(
      attributes,
      editor,
      annotationData,
      selectionModel
    )

    this._subCommands = removeAttributeCommands
    this._logMessage = `remove an attribute {pred: ${this.pred}, obj: ${this.obj}} from ${this.selectedEntities}`
  }
}

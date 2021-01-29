import CompositeCommand from './CompositeCommand'
import getRemoveAttributesByPredCommands from './getRemoveAttributesByPredCommands'

export default class RemoveAttributesFromSelectedEntitiesByPredCommand extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    items,
    attributeDefinition
  ) {
    super()

    const removeAttributeCommands = getRemoveAttributesByPredCommands(
      editor,
      annotationData,
      selectionModel,
      items,
      attributeDefinition.pred
    )

    this._subCommands = removeAttributeCommands
    this._logMessage = `remove ${
      attributeDefinition.pred
    } attribute from items ${items.map((i) => i.id).join(', ')}`
  }
}

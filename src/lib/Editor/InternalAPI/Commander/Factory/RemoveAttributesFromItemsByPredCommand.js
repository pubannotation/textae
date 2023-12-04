import CompositeCommand from './CompositeCommand'
import getRemoveAttributesByPredCommands from './getRemoveAttributesByPredCommands'

export default class RemoveAttributesFromItemsByPredCommand extends CompositeCommand {
  constructor(annotationModel, items, attributeDefinition) {
    super()

    const removeAttributeCommands = getRemoveAttributesByPredCommands(
      annotationModel,
      items,
      attributeDefinition.pred
    )

    this._subCommands = removeAttributeCommands
    this._logMessage = `remove ${
      attributeDefinition.pred
    } attribute from items ${items.map((i) => i.id).join(', ')}`
  }
}

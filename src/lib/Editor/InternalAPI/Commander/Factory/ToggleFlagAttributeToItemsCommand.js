import CompositeCommand from './CompositeCommand'
import getCreateAttributeToItemsCommands from './getCreateAttributeToItemsCommands'
import getRemoveAttributesByPredCommands from './getRemoveAttributesByPredCommands'

export default class ToggleFlagAttributeToItemsCommand extends CompositeCommand {
  constructor(annotationModel, items, attributeDefinition) {
    super()

    this._subCommands = getCreateAttributeToItemsCommands(
      annotationModel,
      items,
      attributeDefinition.pred,
      attributeDefinition.default
    )

    // Toggle exisitng flag type attributes
    const removeAttributeCommands = getRemoveAttributesByPredCommands(
      annotationModel,
      items,
      attributeDefinition.pred
    )

    this._subCommands = this._subCommands.concat(removeAttributeCommands)

    this._logMessage = `toggle flag attirbute ${
      attributeDefinition.pred
    } to item ${items.map(({ id }) => id).join(', ')}`
  }
}

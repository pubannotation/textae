import CompositeCommand from './CompositeCommand'
import getCreateAttributeToItemsCommands from './getCreateAttributeToItemsCommands'
import getRemoveAttributesByPredCommands from './getRemoveAttributesByPredCommands'

export default class ToggleFlagAttributeToItemsCommand extends CompositeCommand {
  constructor(editor, annotationData, items, attributeDefinition) {
    super()

    this._subCommands = getCreateAttributeToItemsCommands(
      editor,
      annotationData,
      items,
      attributeDefinition.pred,
      attributeDefinition.default
    )

    // Toggle exisitng flag type attributes
    const removeAttributeCommands = getRemoveAttributesByPredCommands(
      editor,
      annotationData,
      items,
      attributeDefinition.pred
    )

    this._subCommands = this._subCommands.concat(removeAttributeCommands)

    this._logMessage = `toggle flag attirbute ${
      attributeDefinition.pred
    } to item ${items.map((entity) => entity.id).join(', ')}`
  }
}

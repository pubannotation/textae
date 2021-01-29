import CompositeCommand from './CompositeCommand'
import getCreateAttributeToItemsCommands from './getCreateAttributeToItemsCommands'
import getRemoveAttributesByPredCommands from './getRemoveAttributesByPredCommands'

export default class ToggleFlagAttributeToSelectedEntitiesCommand extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, attributeDefinition) {
    super()

    this._subCommands = getCreateAttributeToItemsCommands(
      annotationData,
      editor,
      selectionModel,
      selectionModel.entity.all,
      attributeDefinition.pred,
      attributeDefinition.default
    )

    // Toggle exisitng flag type attributes
    const removeAttributeCommands = getRemoveAttributesByPredCommands(
      editor,
      annotationData,
      selectionModel,
      selectionModel.entity.all,
      attributeDefinition.pred
    )

    this._subCommands = this._subCommands.concat(removeAttributeCommands)

    this._logMessage = `toggle flag attirbute ${
      attributeDefinition.pred
    } to entity ${selectionModel.entity.all
      .map((entity) => entity.id)
      .join(', ')}`
  }
}

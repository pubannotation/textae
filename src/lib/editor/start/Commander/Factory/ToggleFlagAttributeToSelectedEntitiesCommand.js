import CompositeCommand from './CompositeCommand'
import getCreateAttributeToSelectedEntitiesCommands from './getCreateAttributeToSelectedEntitiesCommands'
import getRemoveAttributesByPredCommands from './getRemoveAttributesByPredCommands'

export default class ToggleFlagAttributeToSelectedEntitiesCommand extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, attributeDefinition) {
    super()

    this._subCommands = getCreateAttributeToSelectedEntitiesCommands(
      annotationData,
      attributeDefinition,
      editor,
      selectionModel
    )

    // Toggle exisitng flag type attributes
    const removeAttributeCommands = getRemoveAttributesByPredCommands(
      editor,
      annotationData,
      selectionModel,
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

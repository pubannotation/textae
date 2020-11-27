import CompositeCommand from './CompositeCommand'
import getRemoveAttributesByPredCommands from './getRemoveAttributesByPredCommands'

export default class RemoveAttributesOfSelectedEntitiesByPredCommand extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, attributeDefinition) {
    super()

    const removeAttributeCommands = getRemoveAttributesByPredCommands(
      editor,
      annotationData,
      selectionModel,
      attributeDefinition
    )

    this._subCommands = removeAttributeCommands
    this._logMessage = `remove attirbute ${
      attributeDefinition.pred
    } to entity ${selectionModel.entity.all
      .map((entity) => entity.id)
      .join(', ')}`
  }
}

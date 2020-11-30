import CompositeCommand from './CompositeCommand'
import getCreateAttributeToSelectedEntitiesCommands from './getCreateAttributeToSelectedEntitiesCommands'

export default class CreateAttributeToSelectedEntitiesCommand extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    attributeDefinition,
    obj
  ) {
    super()

    this._subCommands = getCreateAttributeToSelectedEntitiesCommands(
      annotationData,
      attributeDefinition,
      editor,
      selectionModel,
      obj
    )

    this._logMessage = `create attirbute ${attributeDefinition.pred}:${
      attributeDefinition.default
    } to entity ${selectionModel.entity.all
      .map((entity) => entity.id)
      .join(', ')}`
  }
}

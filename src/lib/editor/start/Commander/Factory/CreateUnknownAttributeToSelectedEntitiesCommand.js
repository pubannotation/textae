import CompositeCommand from './CompositeCommand'
import getCreateAttributeToSelectedEntitiesCommands from './getCreateAttributeToSelectedEntitiesCommands'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, attributeDefinition) {
    super()

    const entities = selectionModel.entity.all

    this._subCommands = getCreateAttributeToSelectedEntitiesCommands(
      entities,
      annotationData,
      attributeDefinition,
      editor,
      selectionModel
    )

    this._logMessage = `create attirbute ${attributeDefinition.pred}:${
      attributeDefinition.default
    } to entity ${entities.join(', ')}`
  }
}

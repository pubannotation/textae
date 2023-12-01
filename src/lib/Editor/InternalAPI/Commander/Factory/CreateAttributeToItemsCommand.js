import CompositeCommand from './CompositeCommand'
import getCreateAttributeToItemsCommands from './getCreateAttributeToItemsCommands'

export default class CreateAttributeToItemsCommand extends CompositeCommand {
  constructor(annotationData, items, attributeDefinition, obj) {
    super()

    this._subCommands = getCreateAttributeToItemsCommands(
      annotationData,
      items,
      attributeDefinition.pred,
      obj || attributeDefinition.default
    )

    this._logMessage = `create attirbute ${attributeDefinition.pred}:${
      attributeDefinition.default
    } to item ${items.map(({ id }) => id).join(', ')}`
  }
}

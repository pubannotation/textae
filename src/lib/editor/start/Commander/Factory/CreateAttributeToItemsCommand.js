import CompositeCommand from './CompositeCommand'
import getCreateAttributeToItemsCommands from './getCreateAttributeToItemsCommands'

export default class CreateAttributeToItemsCommand extends CompositeCommand {
  constructor(editor, annotationData, items, attributeDefinition, obj) {
    super()

    this._subCommands = getCreateAttributeToItemsCommands(
      editor,
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

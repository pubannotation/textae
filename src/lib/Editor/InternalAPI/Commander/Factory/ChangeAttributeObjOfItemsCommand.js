import CompositeCommand from './CompositeCommand'
import ChangeAttributeCommand from './ChangeAttributeCommand'

export default class ChangeAttributeObjOfItemsCommand extends CompositeCommand {
  constructor(eventEmitter, annotationModel, items, attrDef, newObj) {
    super()

    const effectedAttributes = []
    for (const item of items) {
      const attribute = item.attributes.find(
        (a) => a.pred == attrDef.pred && a.obj !== newObj
      )

      if (attribute) {
        effectedAttributes.push(attribute)
      }
    }

    this._subCommands = effectedAttributes.map(
      (attribute) =>
        new ChangeAttributeCommand(annotationModel, attribute, null, newObj)
    )

    if (effectedAttributes.length) {
      this._afterInvoke = () =>
        eventEmitter.emit(
          'textae-event.commander.attributes.change',
          effectedAttributes
        )
    }

    this._logMessage = `update obj ${newObj} to attributes: ${effectedAttributes
      .map((attribute) => attribute.id)
      .join(',')}`
  }
}

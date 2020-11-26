import bindTextaeEvents from './bindTextaeEvents'
import handle from './handle'

export default class EditAttribute {
  constructor(commander, editor, annotationData, selectionModel, entityPallet) {
    this._commander = commander
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._pallet = entityPallet

    bindTextaeEvents(editor, selectionModel, commander)
  }

  addOrEditAttribute(typeDefinition, number) {
    handle(
      this._pallet,
      this._commander,
      this._selectionModel,
      typeDefinition,
      number
    )
  }

  deleteAttribute(typeDefinition, number) {
    const attrDef = typeDefinition.attribute.getAttributeAt(number)

    const command = this._commander.factory.removeAttributesOfSelectedEntitiesByPredCommand(
      attrDef
    )
    this._commander.invoke(command)
  }
}

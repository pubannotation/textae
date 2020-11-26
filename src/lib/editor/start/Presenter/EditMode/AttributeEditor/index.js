import bindTextaeEvents from './bindTextaeEvents'
import handle from './handle'

export default class EditAttribute {
  constructor(
    commander,
    editor,
    annotationData,
    selectionModel,
    entityPallet,
    typeDefinition
  ) {
    this._commander = commander
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._pallet = entityPallet
    this._typeDefinition = typeDefinition

    bindTextaeEvents(editor, selectionModel, commander)
  }

  addOrEditAt(number) {
    handle(
      this._pallet,
      this._commander,
      this._selectionModel,
      this._typeDefinition,
      number
    )
  }

  deleteAt(number) {
    const attrDef = this._typeDefinition.attribute.getAttributeAt(number)

    const command = this._commander.factory.removeAttributesOfSelectedEntitiesByPredCommand(
      attrDef
    )
    this._commander.invoke(command)
  }
}

import alertifyjs from 'alertifyjs'
import bindTextaeEvents from './bindTextaeEvents'
import createNumericAttributeOrShowEditNumericAttributeDialog from './createNumericAttributeOrShowEditNumericAttributeDialog'
import createSelectionAttributeOrShowSelectionAttributePallet from './createSelectionAttributeOrShowSelectionAttributePallet'
import createStringAttributeOrShowEditStringAttributeDialog from './createStringAttributeOrShowEditStringAttributeDialog'
import toggleFlagAttribute from './toggleFlagAttribute'

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
    this._pallet.hide()

    const attrDef = this._typeDefinition.attribute.getAttributeAt(number)

    if (!attrDef) {
      alertifyjs.warning(`Attribute No.${number} is not defined`)
      return
    }

    switch (attrDef.valueType) {
      case 'flag':
        toggleFlagAttribute(attrDef, this._commander)
        break
      case 'numeric':
        createNumericAttributeOrShowEditNumericAttributeDialog(
          this._selectionModel,
          attrDef,
          this._commander
        )
        break
      case 'selection':
        createSelectionAttributeOrShowSelectionAttributePallet(
          this._selectionModel,
          attrDef,
          this._commander,
          this._pallet
        )
        break
      case 'string':
        createStringAttributeOrShowEditStringAttributeDialog(
          this._selectionModel,
          attrDef,
          this._commander
        )
        break
      default:
        throw `${attrDef.valueType} is unknown attribute`
    }
  }

  deleteAt(number) {
    const attrDef = this._typeDefinition.attribute.getAttributeAt(number)

    const command = this._commander.factory.removeAttributesOfSelectedEntitiesByPredCommand(
      attrDef
    )
    this._commander.invoke(command)
  }
}

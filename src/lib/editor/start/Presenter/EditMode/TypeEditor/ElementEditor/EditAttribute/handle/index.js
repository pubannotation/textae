import alertifyjs from 'alertifyjs'
import toggleFlagAttribute from './toggleFlagAttribute'
import createNumericAttributeOrShowEditNumericAttributeDialog from './createNumericAttributeOrShowEditNumericAttributeDialog'
import createSelectionAttributeOrShowSelectionAttributePallet from './createSelectionAttributeOrShowSelectionAttributePallet'
import createStringAttributeOrShowEditStringAttributeDialog from './createStringAttributeOrShowEditStringAttributeDialog'

export default function(
  pallet,
  commander,
  selectionModel,
  typeDefinition,
  number
) {
  pallet.hide()

  const attrDef = typeDefinition.entity.getAttributeAt(number)

  if (!attrDef) {
    alertifyjs.warning(`Attribute No.${number} is not defined`)
    return
  }

  switch (attrDef.valueType) {
    case 'flag':
      toggleFlagAttribute(attrDef, commander)
      break
    case 'numeric':
      createNumericAttributeOrShowEditNumericAttributeDialog(
        selectionModel,
        attrDef,
        commander
      )
      break
    case 'selection':
      createSelectionAttributeOrShowSelectionAttributePallet(
        selectionModel,
        attrDef,
        commander,
        pallet
      )
      break
    case 'string':
      createStringAttributeOrShowEditStringAttributeDialog(
        selectionModel,
        attrDef,
        commander
      )
      break
    default:
      throw `${attrDef.valueType} is unknown attribute`
  }
}

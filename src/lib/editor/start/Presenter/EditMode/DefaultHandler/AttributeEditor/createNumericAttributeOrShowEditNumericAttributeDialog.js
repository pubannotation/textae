import alertifyjs from 'alertifyjs'
import openEditNumericAttributeDialog from '../../../openEditNumericAttributeDialog'

export default function (selectionModelItems, attrDef, commander, pallet) {
  const attribute = selectionModelItems.findSelectedAttributeWithSamePredicate(
    attrDef.pred
  )

  if (attribute) {
    const isOnlyEntityWithJsutOneSamePredSelected =
      selectionModelItems.onlySelectedWithJustOneAttributeOf(attrDef.pred)

    if (isOnlyEntityWithJsutOneSamePredSelected) {
      openEditNumericAttributeDialog(
        selectionModelItems,
        attrDef,
        attribute,
        commander,
        true,
        pallet
      )
    } else {
      alertifyjs.warning(
        'Some selected items has zero or multi this attribute.'
      )
    }
  } else {
    const command = commander.factory.createAttributeToItemsCommand(
      selectionModelItems.all,
      attrDef
    )
    commander.invoke(command)
  }
}

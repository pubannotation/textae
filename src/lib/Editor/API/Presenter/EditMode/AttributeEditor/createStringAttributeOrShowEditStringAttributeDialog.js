import alertifyjs from 'alertifyjs'
import openEditStringAttributeDialog from '../../../../../openEditStringAttributeDialog'

export default function (
  selectionModelItems,
  attrDef,
  commander,
  editProperties,
  pallet
) {
  const attribute = selectionModelItems.findSelectedAttributeWithSamePredicate(
    attrDef.pred
  )

  if (attribute) {
    const isOnlyEntityWithJsutOneSamePredSelected =
      selectionModelItems.onlySelectedWithJustOneAttributeOf(attrDef.pred)

    if (isOnlyEntityWithJsutOneSamePredSelected) {
      openEditStringAttributeDialog(
        selectionModelItems,
        attribute,
        commander,
        attrDef,
        editProperties,
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

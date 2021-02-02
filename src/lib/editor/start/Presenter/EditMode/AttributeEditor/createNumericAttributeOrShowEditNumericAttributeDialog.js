import alertifyjs from 'alertifyjs'
import openEditNumericAttributeDialog from '../../openEditNumericAttributeDialog'

export default function (selectionModel, attrDef, commander) {
  const attribute = selectionModel.entity.findSelectedAttributeWithSamePredicate(
    attrDef.pred
  )

  if (attribute) {
    const isOnlyEntityWithJsutOneSamePredSelected = selectionModel.entity.onlySelectedWithJustOneAttributeOf(
      attrDef.pred
    )

    if (isOnlyEntityWithJsutOneSamePredSelected) {
      openEditNumericAttributeDialog(
        selectionModel.entity,
        attrDef,
        attribute,
        commander
      )
    } else {
      alertifyjs.warning(
        'Some selected items has zero or multi this attribute.'
      )
    }
  } else {
    const command = commander.factory.createAttributeToItemsCommand(
      selectionModel.entity.all,
      attrDef
    )
    commander.invoke(command)
  }
}

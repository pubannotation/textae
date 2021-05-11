import alertifyjs from 'alertifyjs'
import openEditStringAttributeDialog from '../../openEditStringAttributeDialog'

export default function (selectionModel, attrDef, commander) {
  const attribute =
    selectionModel.entity.findSelectedAttributeWithSamePredicate(attrDef.pred)

  if (attribute) {
    const isOnlyEntityWithJsutOneSamePredSelected =
      selectionModel.entity.onlySelectedWithJustOneAttributeOf(attrDef.pred)

    if (isOnlyEntityWithJsutOneSamePredSelected) {
      openEditStringAttributeDialog(
        selectionModel.entity,
        attribute,
        commander,
        attrDef
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

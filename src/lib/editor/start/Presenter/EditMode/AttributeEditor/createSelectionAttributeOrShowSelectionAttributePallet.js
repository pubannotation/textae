export default function (selectionModel, attrDef, commander, pallet) {
  const attribute = selectionModel.entity.findSelectedAttributeWithSamePredicate(
    attrDef.pred
  )

  if (attribute) {
    pallet.show()
    pallet.showAttribute(attrDef.pred)
  } else {
    const command = commander.factory.createAttributeToItemsCommand(
      selectionModel.entity.all,
      attrDef
    )
    commander.invoke(command)
  }
}

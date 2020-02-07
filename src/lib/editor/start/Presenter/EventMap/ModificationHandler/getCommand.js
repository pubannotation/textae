export default function(hasAlready, commander, modificationType, typeEditor) {
  if (hasAlready) {
    return commander.factory.removeModificationCommand(
      modificationType,
      typeEditor
    )
  } else {
    return commander.factory.createModificationCommand(
      modificationType,
      typeEditor
    )
  }
}

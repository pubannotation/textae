export default function(hasAlready, commander, modificationType, typeEditor) {
  if (hasAlready) {
    return commander.factory.modificationRemoveCommand(
      modificationType,
      typeEditor
    )
  } else {
    return commander.factory.modificationCreateCommand(
      modificationType,
      typeEditor
    )
  }
}

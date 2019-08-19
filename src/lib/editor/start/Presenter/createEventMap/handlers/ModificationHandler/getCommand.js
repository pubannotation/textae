export default function(hasAlready, command, modificationType, typeEditor) {
  if (hasAlready) {
    return command.factory.modificationRemoveCommand(
      modificationType,
      typeEditor
    )
  } else {
    return command.factory.modificationCreateCommand(
      modificationType,
      typeEditor
    )
  }
}

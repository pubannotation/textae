export default function(command, pushButtons, modificationType, typeEditor) {
  const hasAlready = pushButtons
    .getButton(modificationType.toLowerCase())
    .value()

  let c
  if (hasAlready) {
    c = command.factory.modificationRemoveCommand(modificationType, typeEditor)
  } else {
    c = command.factory.modificationCreateCommand(modificationType, typeEditor)
  }

  if (c.subCommands.length) {
    command.invoke([c], ['annotation'])
  }
}

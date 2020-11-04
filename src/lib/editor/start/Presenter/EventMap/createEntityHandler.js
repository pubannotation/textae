export default function (commander, typeDefinition) {
  const command = commander.factory.createDefaultTypeEntityToSelectedSpansCommand(
    typeDefinition.entity.defaultType
  )

  if (!command.isEmpty) {
    commander.invoke(command)
  }
}

export default function (commander, typeDefinition) {
  const command =
    commander.factory.createDefaultTypeEntityToSelectedSpansCommand(
      typeDefinition.denotation.defaultType
    )

  if (!command.isEmpty) {
    commander.invoke(command)
  }
}

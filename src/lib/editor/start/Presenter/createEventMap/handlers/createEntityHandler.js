export default function(command, typeDefinition, callback) {
  command.invoke(
    command.factory.createDefaultTypeEntityToSelectedSpansCommand(
      typeDefinition
    )
  )

  callback()
}

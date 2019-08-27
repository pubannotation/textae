export default function(command) {
  command.invoke(
    command.factory.createDefaultAttributeToSelectedEntitiesCommand()
  )
}

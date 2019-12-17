export default function(commander) {
  commander.invoke(
    commander.factory.createDefaultAttributeToSelectedEntitiesCommand()
  )
}

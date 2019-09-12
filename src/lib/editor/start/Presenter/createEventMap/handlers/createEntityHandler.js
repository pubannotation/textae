export default function(commander, typeDefinition, callback) {
  commander.invoke(
    commander.factory.createDefaultTypeEntityToSelectedSpansCommand(
      typeDefinition.entity.defaultType
    )
  )

  callback()
}

import alertifyjs from 'alertifyjs'

export default function(commander, typeDefinition, isSimpleMode) {
  const command = commander.factory.createDefaultTypeEntityToSelectedSpansCommand(
    typeDefinition.entity.defaultType
  )

  if (!command.isEmpty) {
    commander.invoke(command)
    if (isSimpleMode) {
      alertifyjs.success('an instance is created behind.')
    }
  }
}

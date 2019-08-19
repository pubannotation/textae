import getCommand from './getCommand'

export default function(command, pushButtons, modificationType, typeEditor) {
  const hasAlready = pushButtons
    .getButton(modificationType.toLowerCase())
    .value()

  const c = getCommand(hasAlready, command, modificationType, typeEditor)

  if (c.subCommands.length) {
    command.invoke([c], ['annotation'])
  }
}

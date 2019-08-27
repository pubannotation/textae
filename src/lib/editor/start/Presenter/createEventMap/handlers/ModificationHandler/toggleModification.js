import getCommand from './getCommand'

export default function(command, pushButtons, modificationType, typeEditor) {
  const hasAlready = pushButtons
    .getButton(modificationType.toLowerCase())
    .value()

  command.invoke(getCommand(hasAlready, command, modificationType, typeEditor))
}

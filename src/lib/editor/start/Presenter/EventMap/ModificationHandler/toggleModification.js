import getCommand from './getCommand'

export default function(commander, pushButtons, modificationType, typeEditor) {
  const hasAlready = pushButtons
    .getButton(modificationType.toLowerCase())
    .value()

  commander.invoke(
    getCommand(hasAlready, commander, modificationType, typeEditor)
  )
}

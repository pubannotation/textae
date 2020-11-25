export default function (attrDef, commander) {
  const command = commander.factory.toggleFlagAttributeToSelectedEntitiesCommand(
    attrDef
  )
  commander.invoke(command)
}

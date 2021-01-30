export default function (attrDef, commander) {
  commander.invoke(
    commander.factory.toggleFlagAttributeToSelectedEntitiesCommand(attrDef)
  )
}

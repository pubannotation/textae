export default class {
  constructor(commander, annotationData) {
    this._commander = commander
    this._annotationData = annotationData
  }

  handle(typeDefinition, number) {
    const attrDef = typeDefinition.attribute.getAttributeAt(number)

    const command = this._commander.factory.removeAttributesOfSelectedEntitiesByPredCommand(
      attrDef
    )
    this._commander.invoke(command)
  }
}

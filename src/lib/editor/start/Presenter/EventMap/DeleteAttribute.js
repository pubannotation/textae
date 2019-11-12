export default class {
  constructor(commander, annotationData, selectionModel) {
    this._commander = commander
    this._annotationData = annotationData
    this._selectionModel = selectionModel
  }

  handle(typeDefinition, number) {
    const attrDef = typeDefinition.entity.getAttributeAt(number)

    const command = this._commander.factory.attributeRemoveByPredCommand(
      attrDef
    )
    this._commander.invoke(command)
  }
}

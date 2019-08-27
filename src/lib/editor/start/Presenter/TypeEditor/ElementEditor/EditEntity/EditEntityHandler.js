import DefaultHandler from '../DefaultHandler'

export default class extends DefaultHandler {
  constructor(typeDefinition, command, annotationData, selectionModel) {
    super('entity', selectionModel, typeDefinition.entity, command)

    this.annotationData = annotationData.entity
    this.selectionModel = selectionModel.entity
  }

  changeTypeOfSelectedElement(newType) {
    return this.command.factory.changeTypeRemoveRelationOfSelectedEntitiesCommand(
      newType,
      this.typeContainer.isBlock(newType)
    )
  }

  changeLabelCommand(label, value) {
    return this.command.factory.changeEntityLabelCommand(
      label,
      value,
      this.typeContainer
    )
  }
}

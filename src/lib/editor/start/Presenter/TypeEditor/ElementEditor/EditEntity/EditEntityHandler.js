import DefaultHandler from '../DefaultHandler'

export default class extends DefaultHandler {
  constructor(typeDefinition, commander, annotationData, selectionModel) {
    super('entity', selectionModel, typeDefinition.entity, commander)

    this.annotationData = annotationData.entity
    this.selectionModel = selectionModel.entity
  }

  changeTypeOfSelectedElement(newType) {
    return this.commander.factory.changeTypeRemoveRelationOfSelectedEntitiesCommand(
      newType,
      this.typeContainer.isBlock(newType)
    )
  }

  changeLabelCommand(label, value) {
    return this.commander.factory.changeEntityLabelCommand(
      label,
      value,
      this.typeContainer
    )
  }
}

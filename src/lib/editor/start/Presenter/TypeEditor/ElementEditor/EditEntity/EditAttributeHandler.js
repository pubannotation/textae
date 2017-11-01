import DefaultHandler from '../DefaultHandler'

export default class extends DefaultHandler {
  constructor(typeContainer, command, annotationData, selectionModel) {
    super()
    this.typeContainer = typeContainer.attribute
    this.command = command
    this.annotationData = annotationData.attribute
    this.selectionModel = selectionModel.attribute
  }
  changeTypeOfSelectedElement(newType) {
    return this.getEditTarget(newType)
      .map((id) => this.command.factory.attributeChangeTypeCommand(
        id,
        newType
      ))
  }
}

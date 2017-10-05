import DefaultHandler from '../DefaultHandler'

export default class extends DefaultHandler {
  constructor(typeContainer, command, annotationData, selectionModel) {
    super()
    this.typeContainer = typeContainer.attribute
    this.command = command
    this.annotationData = annotationData.attribute
    this.selectionModel = selectionModel.attribute
  }
  getEditTarget(newType, newPred) {
    return this.selectionModel.all()
      .filter((id) => {
        let attribute = this.annotationData.get(id)
        return attribute.type !== newType || attribute.pred !== newPred
      })
  }
  changeSelectedElement(newType, newPred) {
    return this.getEditTarget(newType, newPred)
      .map((id) => this.command.factory.attributeChangeCommand(
        id,
        newType,
        newPred
      ))
  }
  getSelectedPred() {
    let id = this.selectionModel.single()

    if (id) {
      return this.annotationData.get(id).pred
    }
  }
}

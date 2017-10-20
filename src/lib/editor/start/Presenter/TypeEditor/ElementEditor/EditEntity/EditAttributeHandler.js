import DefaultHandler from '../DefaultHandler'

export default class extends DefaultHandler {
  constructor(typeContainer, command, annotationData, selectionModel) {
    super()
    this.typeContainer = typeContainer.attribute
    this.command = command
    this.annotationData = annotationData.attribute
    this.selectionModel = selectionModel.attribute
  }
  getEditTarget(newPred, newValue) {
    return this.selectionModel.all()
      .filter((id) => {
        let attribute = this.annotationData.get(id)
        return attribute.pred !== newPred || attribute.value !== newValue
      })
  }
  changeSelectedElement(newPred, newValue) {
    return this.getEditTarget(newPred, newValue)
      .map((id) => this.command.factory.attributeChangeCommand(
        id,
        newPred,
        newValue
      ))
  }
  getSelectedPred() {
    let id = this.selectionModel.single()

    if (id) {
      return this.annotationData.get(id).pred
    }

    return ''
  }
  getSelectedValue() {
    let id = this.selectionModel.single()

    if (id) {
      return this.annotationData.get(id).value
    }

    return ''
  }
}

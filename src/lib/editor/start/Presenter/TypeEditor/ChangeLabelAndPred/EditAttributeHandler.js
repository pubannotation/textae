import GetSelectedIdEditable from '../GetSelectedIdEditable'

export default class extends GetSelectedIdEditable {
  constructor(annotationData, selectionModel) {
    super()
    this.annotationData = annotationData.attribute
    this.selectionModel = selectionModel.attribute
  }

  changeSelectedElement(command, newPred, newValue) {
    return getEditTarget(this.selectionModel.all(), this.annotationData, newPred, newValue)
      .map((id) => command.factory.attributeChangeCommand(
        id,
        newPred,
        newValue
      ))
  }

  getSelectedPred() {
    const id = this.selectionModel.single()

    if (id) {
      return this.annotationData.get(id).pred
    }

    return ''
  }

  getSelectedValue() {
    const id = this.selectionModel.single()

    if (id) {
      return this.annotationData.get(id).value
    }

    return ''
  }
}

function getEditTarget(selecteds, annotationData, newPred, newValue) {
  return selecteds.filter((id) => different(annotationData, id, newPred, newValue))
}

function different(annotationData, id, newPred, newValue) {
  const attribute = annotationData.get(id)
  return attribute.pred !== newPred || attribute.value !== newValue
}


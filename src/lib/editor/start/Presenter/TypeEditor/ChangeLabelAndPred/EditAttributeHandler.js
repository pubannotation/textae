export default class {
  constructor(annotationData) {
    this.annotationData = annotationData.attribute
  }

  getSelectedPred(id) {
    if (id) {
      return this.annotationData.get(id).pred
    }

    return ''
  }

  getSelectedValue(id) {
    if (id) {
      return this.annotationData.get(id).value
    }

    return ''
  }
}

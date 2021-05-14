export default class UpdateEntityElements {
  constructor(annotationData) {
    this._annotationData = annotationData
  }

  updateAttribute(pred) {
    for (const entity of this._annotationData.entity.all.filter((e) =>
      e.typeValues.hasSpecificPredicateAttribute(pred)
    )) {
      entity.updateElement()
    }
  }
}

export default class UpdateEntityElements {
  constructor(annotationData) {
    this._annotationData = annotationData
  }

  updateEntityHtmlelement(typeName) {
    for (const entity of this._annotationData.entity.all) {
      // If the type name ends in a wildcard, look for the DOMs to update with a forward match.
      if (
        entity.typeName === typeName ||
        (typeName.lastIndexOf('*') === typeName.length - 1 &&
          entity.typeName.indexOf(typeName.slice(0, -1) === 0))
      ) {
        entity.updateElement()
      }
    }
  }

  updateAttribute(pred) {
    for (const entity of this._annotationData.entity.all.filter((e) =>
      e.typeValues.hasSpecificPredicateAttribute(pred)
    )) {
      entity.updateElement()
    }
  }

  updateEntityHtmlelementAll() {
    for (const entity of this._annotationData.entity.all) {
      entity.updateElement()
    }
  }
}

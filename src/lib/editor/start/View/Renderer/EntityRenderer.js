export default class EntityRenderer {
  constructor(annotationData) {
    this._annotationData = annotationData
  }

  render(entity) {
    entity.renderAtTheGrid()
  }

  remove(entity) {
    if (entity.span.entities.length === 0) {
      // Destroy a grid when all entities are remove.
      entity.span.destroyGridElement()
    } else {
      // Destroy whole of type DOM.
      entity.destroyElement()
    }
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

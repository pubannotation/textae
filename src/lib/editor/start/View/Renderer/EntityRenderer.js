export default class EntityRenderer {
  constructor(annotationData) {
    this._annotationData = annotationData
  }

  render(entity) {
    // Don't delete child Span on span moves.
    // Check if a child span is already present so that it is not drawn twice.
    if (entity.element) {
      return
    }

    // A span have one grid and a grid can have multi types and a type can have multi entities.
    // A grid is only shown when at least one entity is owned by a correspond span.
    const grid = entity.span.gridElement || entity.span.renderGridElement()

    // Append a new entity to the type
    const element = entity.renderElement()
    grid.insertAdjacentElement('beforeend', element)

    entity.reflectEntityGapInTheHeight()
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
      e.hasSpecificPredicateAttribute(pred)
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

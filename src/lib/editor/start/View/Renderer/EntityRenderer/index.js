import create from './create'
import destroy from './destroy'

export default class EntityRenderer {
  constructor(annotationData, selectionModel) {
    this._annotationData = annotationData
    this._selectionModel = selectionModel
  }

  render(entity) {
    create(entity, this._annotationData.namespace)

    entity.reflectEntityGapInTheHeight()
  }

  change(entity) {
    entity.updateElement(
      this._annotationData.namespace,
      this._selectionModel.entity.has(entity.id)
    )

    entity.reflectEntityGapInTheHeight()
  }

  remove(entity) {
    destroy(entity)
  }

  updateEntityHtmlelement(typeName) {
    for (const entity of this._annotationData.entity.all) {
      // If the type name ends in a wildcard, look for the DOMs to update with a forward match.
      if (
        entity.typeName === typeName ||
        (typeName.lastIndexOf('*') === typeName.length - 1 &&
          entity.typeName.indexOf(typeName.slice(0, -1) === 0))
      ) {
        this.change(entity)
      }
    }
  }

  updateAttribute(pred) {
    for (const entity of this._annotationData.entity.all.filter((e) =>
      e.hasSpecificPredicateAttribute(pred)
    )) {
      this.change(entity)
    }
  }

  updateEntityHtmlelementAll() {
    for (const entity of this._annotationData.entity.all) {
      this.change(entity)
    }
  }
}

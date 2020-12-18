import create from './create'
import destroy from './destroy'
import EntityModel from '../../../../EntityModel'

export default class EntityRenderer {
  constructor(
    annotationData,
    selectionModel,
    typeCantainerForDenotation,
    typeCantainerForBlock,
    attributeContainer
  ) {
    this._annotationData = annotationData
    this._typeContainerForDenotation = typeCantainerForDenotation
    this._typeContainerForBlock = typeCantainerForBlock
    this._attributeContainer = attributeContainer
    this._selectionModel = selectionModel
  }

  render(entity) {
    create(
      this._getTypeContainerFor(entity),
      this._getTypeContainerFor(entity).attributeContainer,
      entity,
      this._annotationData.namespace
    )

    entity.reflectEntityGapInTheHeight()
  }

  change(entity) {
    entity.updateElement(
      this._annotationData.namespace,
      this._getTypeContainerFor(entity),
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
    for (const entity of EntityModel.filterWithSamePredicateAttribute(
      this._annotationData.entity.all,
      pred
    )) {
      this.change(entity)
    }
  }

  updateEntityHtmlelementAll() {
    for (const entity of this._annotationData.entity.all) {
      this.change(entity)
    }
  }

  _getTypeContainerFor(entity) {
    if (entity.isDenotation) {
      return this._typeContainerForDenotation
    } else if (entity.isBlock) {
      return this._typeContainerForBlock
    } else {
      throw 'unknown entity type'
    }
  }
}

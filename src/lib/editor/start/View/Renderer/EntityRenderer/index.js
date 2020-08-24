import create from './create'
import destroy from './destroy'
import setTypeGapHeight from './setTypeGapHeight'
import update from './update'
import EntityModel from '../../../../EntityModel'

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    typeCantainer,
    gridRenderer,
    typeGap
  ) {
    this._editor = editor
    this._annotationData = annotationData
    this._typeContainer = typeCantainer
    this._gridRenderer = gridRenderer
    this._selectionModel = selectionModel
    this._typeGap = typeGap
  }

  render(entity) {
    create(
      this._typeContainer,
      this._gridRenderer,
      entity,
      this._annotationData.namespace
    )

    setTypeGapHeight(entity, this._typeGap)
  }

  change(entity) {
    update(
      this._editor,
      this._selectionModel,
      this._annotationData.namespace,
      this._typeContainer,
      entity
    )

    setTypeGapHeight(entity, this._typeGap)
  }

  remove(entity) {
    destroy(this._annotationData, this._gridRenderer, entity)
  }

  updateTypeDom(typeName) {
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

  updateTypeDomAll() {
    for (const entity of this._annotationData.entity.all) {
      this.change(entity)
    }
  }
}

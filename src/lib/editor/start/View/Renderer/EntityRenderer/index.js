import create from './create'
import changeTypeOfExists from './changeTypeOfExists'
import destroy from './destroy'
import setTypeGapHeight from './setTypeGapHeight'
import updateTypeDom from './updateTypeDom'

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
      this._editor,
      this._typeContainer,
      this._gridRenderer,
      entity,
      this._annotationData.namespace
    )

    setTypeGapHeight(entity, this._typeGap)
  }

  change(entity) {
    changeTypeOfExists(
      this._editor,
      this._annotationData,
      this._selectionModel,
      this._typeContainer,
      this._gridRenderer,
      entity
    )

    setTypeGapHeight(entity, this._typeGap)
  }

  remove(entity) {
    destroy(this._editor, this._annotationData, this._gridRenderer, entity)
  }

  updateTypeDom(typeName) {
    for (const type of this._annotationData.entity.types) {
      // If the type name ends in a wildcard, look for the DOMs to update with a forward match.
      if (
        type.name === typeName ||
        (typeName.lastIndexOf('*') === typeName.length - 1 &&
          type.name.indexOf(typeName.slice(0, -1) === 0))
      ) {
        updateTypeDom(this._annotationData.namespace, this._typeContainer, type)
      }
    }
  }

  updateAttribute(pred) {
    for (const type of this._annotationData.entity.types) {
      if (type.withSamePredicateAttribute(pred)) {
        updateTypeDom(this._annotationData.namespace, this._typeContainer, type)
      }
    }
  }

  updateTypeDomAll() {
    for (const type of this._annotationData.entity.types) {
      updateTypeDom(this._annotationData.namespace, this._typeContainer, type)
    }
  }
}

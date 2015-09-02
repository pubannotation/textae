import selectSpan from './selectSpan'
import selectEntity from './selectEntity'
import selectNextSpan from './selectNextSpan'
import {
  selectLeftEntity, selectRightEntity
}
from './selectNextEntity'

export default function(annotationData, selectionModel, typeContainer) {
  return {
    selectLeft: () => selectLeft(annotationData, selectionModel, typeContainer),
    selectRight: () => selectRight(annotationData, selectionModel, typeContainer),
    selectUp: () => selectEntityLayer(annotationData, selectionModel),
    selectDown: () => selectSpanLayer(annotationData, selectionModel)
  }
}

function selectLeft(annotationData, selectionModel, typeContainer) {
  selectNextSpan(annotationData, selectionModel, 'left')
  selectLeftEntity(annotationData, selectionModel, typeContainer)
}

function selectRight(annotationData, selectionModel, typeContainer) {
  selectNextSpan(annotationData, selectionModel, 'right')
  selectRightEntity(annotationData, selectionModel, typeContainer)
}

function selectEntityLayer(annotationData, selectionModel) {
  let spanId = selectionModel.span.single()

  if (spanId) {
    let span = annotationData.span.get(spanId),
      entities = span.getEntities()
    selectEntity(selectionModel, entities[0])
  }
}

function selectSpanLayer(annotationData, selectionModel) {
  let entityId = selectionModel.entity.single()
  if (entityId) {
    let entity = annotationData.entity.get(entityId),
      span = annotationData.span.get(entity.span)

    selectSpan(selectionModel, span)
  }
}

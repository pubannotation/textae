import selectEntity from './selectEntity'

export {
  selectLeftEntity,
  selectRightEntity
}

function selectLeftEntity(annotationData, selectionModel, typeContainer) {
  let entityId = selectionModel.entity.single()

  if (entityId) {
    let entity = annotationData.entity.get(entityId),
      span = annotationData.span.get(entity.span),
      brothers = span.getEntities(),
      index = brothers.indexOf(entityId)

    if (brothers[index - 1]) {
      selectEntity(selectionModel, brothers[index - 1])
    } else {
      if (span.left) {
        let next = left(span, typeContainer)
        selectEntity(selectionModel, next)
      }
    }
  }
}

function selectRightEntity(annotationData, selectionModel, typeContainer) {
  let entityId = selectionModel.entity.single()

  if (entityId) {
    let entity = annotationData.entity.get(entityId),
      span = annotationData.span.get(entity.span),
      brothers = span.getEntities(),
      index = brothers.indexOf(entityId)

    if (brothers[index + 1]) {
      selectEntity(selectionModel, brothers[index + 1])
    } else {
      if (span.right) {
        let next = right(span, typeContainer)
        selectEntity(selectionModel, next)
      }
    }
  }
}

function left(span, typeContainer) {
  if (span.left) {
    let types = getTypeWithoutBlock(span.left, typeContainer)

    if (types.length) {
      return types[types.length - 1].entities[types[types.length - 1].entities.length - 1]
    } else {
      return left(span.left, typeContainer)
    }
  }
}

function right(span, typeContainer) {
  if (span.right) {
    let types = getTypeWithoutBlock(span.right, typeContainer)

    if (types.length) {
      return types[0].entities[0]
    } else {
      return right(span.right, typeContainer)
    }
  }
}

function getTypeWithoutBlock(span, typeContainer) {
  return span
    .getTypes()
    .filter(t => !typeContainer.entity.isBlock(t.name))
}

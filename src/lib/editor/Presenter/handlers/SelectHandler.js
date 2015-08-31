export default function(annotationData, selectionModel, typeContainer) {
  return {
    selectLeft: () => selectNext(annotationData, selectionModel, 'left', typeContainer),
    selectRight: () => selectNext(annotationData, selectionModel, 'right', typeContainer)
  }
}

function selectNext(annotationData, selectionModel, direction, typeContainer) {
  selectNextSpan(annotationData, selectionModel, direction)
  selectNextEntity(annotationData, selectionModel, direction, typeContainer)
}

function selectNextSpan(annotationData, selectionModel, direction) {
  let spanId = selectionModel.span.single()

  if (spanId) {
    let span = annotationData.span.get(spanId)

    if (span[direction]) {
      selectionModel.clear()
      selectionModel.span.add(span[direction].id)
    }
  }
}

function selectNextEntity(annotationData, selectionModel, direction, typeContainer) {
  let entityId = selectionModel.entity.single()
  if (entityId) {
    let entity = annotationData.entity.get(entityId),
      span = annotationData.span.get(entity.span),
      brothers = span.getEntities(),
      index = brothers.indexOf(entityId)

    if (direction === 'left') {
      if (brothers[index - 1]) {
        selectEntity(selectionModel, brothers[index - 1])
      } else {
        if (span[direction]) {
          let next = left(span, direction, typeContainer)
          selectEntity(selectionModel, next)
        }
      }
    }

    if (direction === 'right') {
      if (brothers[index + 1]) {
        selectEntity(selectionModel, brothers[index + 1])
      } else {
        if (span[direction]) {
          let next = right(span, direction, typeContainer)
          selectEntity(selectionModel, next)
        }
      }
    }
  }
}

function left(span, direction, typeContainer) {
  if (span[direction]) {
    let types = getTypeWithoutBlock(span[direction], typeContainer)

    if (types.length) {
      return types[types.length - 1].entities[types[types.length - 1].entities.length - 1]
    } else {
      return left(span[direction], direction, typeContainer)
    }
  }
}

function right(span, direction, typeContainer) {
  if (span[direction]) {
    let types = getTypeWithoutBlock(span[direction], typeContainer)

    if (types.length) {
      return types[0].entities[0]
    } else {
      return right(span[direction], direction, typeContainer)
    }
  }
}

function getTypeWithoutBlock(span, typeContainer) {
  return span
    .getTypes()
    .filter(t => !typeContainer.entity.isBlock(t.name))
}

function selectEntity(selectionModel, id) {
  console.assert(selectionModel, 'selectionModel MUST not undefined.')
  console.assert(id, 'id MUST not undefined.')

  selectionModel.clear()
  selectionModel.entity.add(id)
}

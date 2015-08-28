export default function(annotationData, selectionModel) {
  return {
    selectLeftSpan: () => selectNextSpan(annotationData, selectionModel, 'left'),
    selectRightSpan: () => selectNextSpan(annotationData, selectionModel, 'right')
  }
}

function selectNextSpan(annotationData, selectionModel, direction) {
  let spanId = selectionModel.span.single()

  if (spanId) {
    let span = annotationData.span.get(spanId)

    if (span[direction]) {
      selectionModel.clear()
      selectionModel.span.add(span[direction].id)
    }
  } else {
    selectNextEntity(annotationData, selectionModel, direction)
  }
}

function selectNextEntity(annotationData, selectionModel, direction) {
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
          let cousins = span[direction].getEntities()
          selectEntity(selectionModel, cousins[cousins.length - 1])
        }
      }
    }

    if (direction === 'right') {
      if (brothers[index + 1]) {
        selectEntity(selectionModel, brothers[index + 1])
      } else {
        if (span[direction]) {
          let cousins = span[direction].getEntities()
          selectEntity(selectionModel, cousins[0])
        }
      }
    }
  }
}

function selectEntity(selectionModel, id) {
  selectionModel.clear()
  selectionModel.entity.add(id)
}

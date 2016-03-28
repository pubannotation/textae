import selectPosition from './selectPosition'

export default function(model, spanAdjuster) {
  return {
    create: (selection, spanConfig) => create(model, spanAdjuster, selection, spanConfig),
    expand: (spanId, selection, spanConfig) => expand(model, spanAdjuster, spanId, selection, spanConfig),
    shrink: (spanId, selection, spanConfig) => shrink(model, spanAdjuster, spanId, selection, spanConfig)
  }
}

function create(model, spanAdjuster, selection, spanConfig) {
  model.selectionModel.clear()
  return getNewSpan(model, spanAdjuster, selection, spanConfig)
}

function expand(model, spanAdjuster, spanId, selection, spanConfig) {
  model.selectionModel.clear()

  const anchorPosition = selectPosition.getAnchorPosition(model.annotationData, selection),
    focusPosition = selectPosition.getFocusPosition(model.annotationData, selection)

  return getNewExpandSpan(model, spanAdjuster, spanId, anchorPosition, focusPosition, spanConfig)
}

function shrink(model, spanAdjuster, spanId, selection, spanConfig) {
  model.selectionModel.clear()

  const anchorPosition = selectPosition.getAnchorPosition(model.annotationData, selection),
    focusPosition = selectPosition.getFocusPosition(model.annotationData, selection)

  return getNewShortSpan(model, spanAdjuster, spanId, anchorPosition, focusPosition, spanConfig)
}

function getNewSpan(model, spanAdjuster, selection, spanConfig) {
  var positions = selectPosition.toPositions(model.annotationData, selection)
  return {
    begin: spanAdjuster.backFromBegin(model.annotationData.sourceDoc, positions.anchorPosition, spanConfig),
    end: spanAdjuster.forwardFromEnd(model.annotationData.sourceDoc, positions.focusPosition - 1, spanConfig) + 1
  }
}

function getNewExpandSpan(model, spanAdjuster, spanId, anchorPosition, focusPosition, spanConfig) {
  var span = model.annotationData.span.get(spanId)

  if (anchorPosition > focusPosition) {
    // expand to the left
    return {
      begin: spanAdjuster.backFromBegin(model.annotationData.sourceDoc, focusPosition, spanConfig),
      end: span.end
    }
  } else {
    // expand to the right
    return {
      begin: span.begin,
      end: spanAdjuster.forwardFromEnd(model.annotationData.sourceDoc, focusPosition - 1, spanConfig) + 1
    }
  }
}

function getNewShortSpan(model, spanAdjuster, spanId, anchorPosition, focusPosition, spanConfig) {
  const span = model.annotationData.span.get(spanId)

  if (anchorPosition < focusPosition) {
    // shorten the left boundary
    if (span.end === focusPosition) return {
      begin: span.end,
      end: span.end
    }

    return {
      begin: spanAdjuster.forwardFromBegin(model.annotationData.sourceDoc, focusPosition, spanConfig),
      end: span.end
    }
  } else {
    // shorten the right boundary
    if (span.begin === focusPosition) return {
      begin: span.begin,
      end: span.begin
    }

    return {
      begin: span.begin,
      end: spanAdjuster.backFromEnd(model.annotationData.sourceDoc, focusPosition - 1, spanConfig) + 1
    }
  }
}

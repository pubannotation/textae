import getHeightIncludeDescendantGrids from '../getHeightIncludeDescendantGrids'
import calcAttributeHeightOfGrid from '../calcAttributeHeightOfGrid'
import getGridOfSpan from './getGridOfSpan'

export default function(getSpan, typeContainer, typeGap, span) {
  if (span.children.length === 0) {
    return stickGridOnSpan(getSpan, span, typeGap)
  } else {
    return pullUpGridOverDescendants(getSpan, typeContainer, typeGap, span)
  }
}

function stickGridOnSpan(getSpan, span, typeGap) {
  const entityPaneHeight = typeGap.showInstance ? 16 : 0
  const spanPosition = getSpan(span.id)
  const griHeight = getGridOfSpan(span.id).offsetHeight + entityPaneHeight + calcAttributeHeightOfGrid(span.id)

  return {
    top: spanPosition.top - griHeight,
    left: spanPosition.left
  }
}

function pullUpGridOverDescendants(getSpan, typeContainer, typeGap, span) {
  // Culculate the height of the grid include descendant grids, because css style affects slowly.
  const spanPosition = getSpan(span.id)
  const descendantsMaxHeight = getHeightIncludeDescendantGrids(span, typeContainer, typeGap)

  return {
    top: spanPosition.top - descendantsMaxHeight,
    left: spanPosition.left
  }
}

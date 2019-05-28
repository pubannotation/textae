import getHeightIncludeDescendantGrids from '../getHeightIncludeDescendantGrids'
import calcAttributeHeightOfGrid from '../calcAttributeHeightOfGrid'
import getGridOfSpan from './getGridOfSpan'
import $ from 'jquery'

export default function(getSpan, typeContainer, typeGapValue, span) {
  if (span.children.length === 0) {
    return stickGridOnSpan(getSpan, span)
  } else {
    return pullUpGridOverDescendants(getSpan, typeContainer, typeGapValue, span)
  }
}

function stickGridOnSpan(getSpan, span) {
  const spanPosition = getSpan(span.id)

  return {
    top: spanPosition.top - calcHeightOfGrid(span.id) + 2, // '+2' means nothing special, just tweaking.
    left: spanPosition.left
  }
}

function calcHeightOfGrid(spanId) {
  return $(getGridOfSpan(spanId)).outerHeight() + 18 + calcAttributeHeightOfGrid(spanId)
}

function pullUpGridOverDescendants(getSpan, typeContainer, typeGapValue, span) {
  // Culculate the height of the grid include descendant grids, because css style affects slowly.
  const spanPosition = getSpan(span.id)
  const descendantsMaxHeight = getHeightIncludeDescendantGrids(span, typeContainer, typeGapValue)

  return {
    top: spanPosition.top - descendantsMaxHeight - calcAttributeHeightOfGrid(span.id),
    left: spanPosition.left
  }
}

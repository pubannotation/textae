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
  var spanPosition = getSpan(span.id)

  return {
    top: spanPosition.top - calcHeightOfGrid(span.id),
    left: spanPosition.left
  }
}

function calcHeightOfGrid(spanId) {
  return $(getGridOfSpan(spanId)).outerHeight() + 18 + calcAttributeHeightOfGrid(spanId)
}

function pullUpGridOverDescendants(getSpan, typeContainer, typeGapValue, span) {
  // Culculate the height of the grid include descendant grids, because css style affects slowly.
  var spanPosition = getSpan(span.id),
    descendantsMaxHeight = getHeightIncludeDescendantGrids(span, typeContainer, typeGapValue)

  return {
    top: spanPosition.top - descendantsMaxHeight - calcAttributeHeightOfGrid(span.id),
    left: spanPosition.left
  }
}

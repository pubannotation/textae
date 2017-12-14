import getHeightIncludeDescendantGrids from '../getHeightIncludeDescendantGrids'
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
    top: spanPosition.top - $(getGridOfSpan(span.id)).outerHeight(),
    left: spanPosition.left
  }
}

function pullUpGridOverDescendants(getSpan, typeContainer, typeGapValue, span) {
  // Culculate the height of the grid include descendant grids, because css style affects slowly.
  var spanPosition = getSpan(span.id),
    descendantsMaxHeight = getHeightIncludeDescendantGrids(span, typeContainer, typeGapValue)

  return {
    top: spanPosition.top - descendantsMaxHeight,
    left: spanPosition.left
  }
}

export default function(getSpan, gridHeight, span) {
  const spanPosition = getSpan(span.id)
  const descendantsMaxHeight = gridHeight.getHeightIncludeDescendantGrids(span)

  return {
    top: spanPosition.top - descendantsMaxHeight,
    left: spanPosition.left
  }
}

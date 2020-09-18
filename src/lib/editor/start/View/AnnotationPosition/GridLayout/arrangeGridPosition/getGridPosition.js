export default function(spanPosition, gridHeight, span) {
  const descendantsMaxHeight = gridHeight.getHeightIncludeDescendantGrids(span)

  return {
    top: spanPosition.top - descendantsMaxHeight,
    left: spanPosition.left
  }
}

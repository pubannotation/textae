import getGridHeight from './getGridHeight'

export default function getHeightIncludeDescendantGrids(
  span,
  typeDefinition,
  typeGap
) {
  const descendantsMaxHeight =
    span.children.length === 0 ? 0 : getMaxHeight(span, typeDefinition, typeGap)
  const gridHeight = getGridHeight(span, typeDefinition, typeGap)

  return gridHeight + descendantsMaxHeight
}

function getMaxHeight(span, typeDefinition, typeGap) {
  return Math.max.apply(
    null,
    span.children.map((childSpan) =>
      getHeightIncludeDescendantGrids(childSpan, typeDefinition, typeGap)
    )
  )
}

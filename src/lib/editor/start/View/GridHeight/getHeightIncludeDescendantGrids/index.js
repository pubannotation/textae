import getGridHeight from './getGridHeight'

export default function getHeightIncludeDescendantGrids(
  span,
  typeGap,
  annotationData
) {
  const descendantsMaxHeight =
    span.children.length === 0 ? 0 : getMaxHeight(span, typeGap, annotationData)
  const gridHeight = getGridHeight(span, typeGap)

  return gridHeight + descendantsMaxHeight
}

function getMaxHeight(span, typeGap, annotationData) {
  return Math.max.apply(
    null,
    span.children.map((childSpan) =>
      getHeightIncludeDescendantGrids(childSpan, typeGap, annotationData)
    )
  )
}

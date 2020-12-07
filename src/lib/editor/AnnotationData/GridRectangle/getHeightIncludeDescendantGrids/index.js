import getGridHeight from './getGridHeight'

export default function getHeightIncludeDescendantGrids(span, annotationData) {
  const descendantsMaxHeight =
    span.children.length === 0 ? 0 : getMaxHeight(span, annotationData)
  const gridRectangle = getGridHeight(span, annotationData.entityGap.value)

  return gridRectangle + descendantsMaxHeight
}

function getMaxHeight(span, annotationData) {
  return Math.max.apply(
    null,
    span.children.map((childSpan) =>
      getHeightIncludeDescendantGrids(childSpan, annotationData)
    )
  )
}

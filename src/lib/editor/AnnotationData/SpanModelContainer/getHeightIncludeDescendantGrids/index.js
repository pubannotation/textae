import getGridHeight from './getGridHeight'

export default function getHeightIncludeDescendantGrids(span, typeGap) {
  const descendantsMaxHeight =
    span.children.length === 0 ? 0 : getMaxHeight(span, typeGap)
  const height = getGridHeight(span, typeGap)

  return height + descendantsMaxHeight
}

function getMaxHeight(span, typeGap) {
  return Math.max.apply(
    null,
    span.children.map((childSpan) =>
      getHeightIncludeDescendantGrids(childSpan, typeGap)
    )
  )
}

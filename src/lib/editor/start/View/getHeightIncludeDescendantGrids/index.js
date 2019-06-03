import getGridHeight from './getGridHeight'

export default function getHeightIncludeDescendantGrids(span, typeContainer, typeGap) {
  const descendantsMaxHeight = span.children.length === 0 ? 0 : getMaxHeight(span, typeContainer, typeGap)
  const gridHeight = getGridHeight(span, typeContainer, typeGap)

  return gridHeight + descendantsMaxHeight
}

function getMaxHeight(span, typeContainer, typeGap) {
  return Math.max.apply(null,
    span.children.map(childSpan => getHeightIncludeDescendantGrids(childSpan, typeContainer, typeGap))
  )
}

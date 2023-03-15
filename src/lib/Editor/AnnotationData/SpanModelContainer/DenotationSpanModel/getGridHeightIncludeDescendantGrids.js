/**
 *
 * @param {import('./index').default} span
 * @param {number} typeGap
 * @returns {number}
 */
export default function getGridHeightIncludeDescendantGrids(span) {
  const descendantsMaxHeight =
    span.children.length === 0 ? 0 : getMaxHeight(span)
  const height = span.gridHeight

  return height + descendantsMaxHeight
}

function getMaxHeight(span) {
  return Math.max.apply(
    null,
    span.children.map((childSpan) =>
      getGridHeightIncludeDescendantGrids(childSpan)
    )
  )
}

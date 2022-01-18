export default function (spans, typeGap) {
  const maxHeight = Math.max(
    ...spans.map((span) => span.getHeightIncludeDescendantGrids())
  )
  return maxHeight
}

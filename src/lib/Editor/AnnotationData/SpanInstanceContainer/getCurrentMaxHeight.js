export default function (spans) {
  const maxHeight = Math.max(
    ...spans.map((span) => span.heightIncludeDescendantGrids)
  )
  return maxHeight
}

const TEXT_HEIGHT = 23
const MARGIN_TOP = 30

export default function (spans, typeGap) {
  const maxHeight = Math.max(
    ...spans.map((span) => span.getHeightIncludeDescendantGrids(typeGap))
  )
  return maxHeight + TEXT_HEIGHT + MARGIN_TOP
}

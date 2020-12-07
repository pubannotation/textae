import getHeightIncludeDescendantGrids from '../GridRectangle/getHeightIncludeDescendantGrids'

const TEXT_HEIGHT = 23
const MARGIN_TOP = 30

export default function (spanContainer) {
  const maxHeight = Math.max(
    ...spanContainer.allDenotationSpans.map((span) =>
      getHeightIncludeDescendantGrids(span, spanContainer._entityGap.value)
    )
  )
  return maxHeight + TEXT_HEIGHT + MARGIN_TOP
}

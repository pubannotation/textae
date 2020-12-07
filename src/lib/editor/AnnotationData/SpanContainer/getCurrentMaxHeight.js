import getHeightIncludeDescendantGrids from './getHeightIncludeDescendantGrids'

const TEXT_HEIGHT = 23
const MARGIN_TOP = 30

export default function (spanContainer, typeGap) {
  const maxHeight = Math.max(
    ...spanContainer.allDenotationSpans.map((span) =>
      getHeightIncludeDescendantGrids(span, typeGap)
    )
  )
  return maxHeight + TEXT_HEIGHT + MARGIN_TOP
}

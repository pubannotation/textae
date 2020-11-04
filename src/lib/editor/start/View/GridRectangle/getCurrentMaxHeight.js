import getHeightIncludeDescendantGrids from './getHeightIncludeDescendantGrids'

const TEXT_HEIGHT = 23
const MARGIN_TOP = 30

export default function (annotationData, typeGap) {
  const maxHeight = Math.max(
    ...annotationData.span.allDenotationSpans.map((span) =>
      getHeightIncludeDescendantGrids(span, typeGap(), annotationData)
    )
  )
  return maxHeight + TEXT_HEIGHT + MARGIN_TOP
}

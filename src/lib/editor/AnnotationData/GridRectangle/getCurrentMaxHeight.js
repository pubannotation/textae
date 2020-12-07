import getHeightIncludeDescendantGrids from './getHeightIncludeDescendantGrids'

const TEXT_HEIGHT = 23
const MARGIN_TOP = 30

export default function (annotationData) {
  const maxHeight = Math.max(
    ...annotationData.span.allDenotationSpans.map((span) =>
      getHeightIncludeDescendantGrids(
        span,
        annotationData.span._entityGap.value
      )
    )
  )
  return maxHeight + TEXT_HEIGHT + MARGIN_TOP
}

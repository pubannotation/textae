import getHeightIncludeDescendantGrids from '../../getHeightIncludeDescendantGrids'

export default function(getSpan, typeGap, span, annotationData) {
  const spanPosition = getSpan(span.id)
  const descendantsMaxHeight = getHeightIncludeDescendantGrids(
    span,
    typeGap,
    annotationData
  )

  return {
    top: spanPosition.top - descendantsMaxHeight,
    left: spanPosition.left
  }
}

import getHeightIncludeDescendantGrids from '../../getHeightIncludeDescendantGrids'

export default function(getSpan, typeContainer, typeGap, span) {
  const spanPosition = getSpan(span.id)
  const descendantsMaxHeight = getHeightIncludeDescendantGrids(span, typeContainer, typeGap)

  return {
    top: spanPosition.top - descendantsMaxHeight,
    left: spanPosition.left
  }
}

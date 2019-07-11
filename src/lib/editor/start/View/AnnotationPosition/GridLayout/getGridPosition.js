import getHeightIncludeDescendantGrids from '../../getHeightIncludeDescendantGrids'

export default function(getSpan, typeDefinition, typeGap, span) {
  const spanPosition = getSpan(span.id)
  const descendantsMaxHeight = getHeightIncludeDescendantGrids(span, typeDefinition, typeGap)

  return {
    top: spanPosition.top - descendantsMaxHeight,
    left: spanPosition.left
  }
}

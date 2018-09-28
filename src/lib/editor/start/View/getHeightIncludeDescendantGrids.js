import _ from 'underscore'

export default function getHeightIncludeDescendantGrids(span, typeContainer, typeGapValue) {
  var descendantsMaxHeight = span.children.length === 0 ? 0 :
    _.max(
      span.children.map(childSpan => getHeightIncludeDescendantGrids(childSpan, typeContainer, typeGapValue))
    ),
    gridHeight = span.getTypes()
    .filter(type => !typeContainer.entity.isBlock(type.name))
    .length * (typeGapValue * 18 + 18)

  return gridHeight + descendantsMaxHeight
}

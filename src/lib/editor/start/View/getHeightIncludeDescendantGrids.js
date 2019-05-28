import _ from 'underscore'
import calcAttributeHeightOfGrid from './calcAttributeHeightOfGrid'

export default function getHeightIncludeDescendantGrids(span, typeContainer, typeGapValue) {
  const descendantsMaxHeight = span.children.length === 0 ? 0 :
    _.max(
      span.children.map(childSpan => getHeightIncludeDescendantGrids(childSpan, typeContainer, typeGapValue))
    )

  const gridHeight = span.getTypes()
    .filter(type => !typeContainer.entity.isBlock(type.name))
    .length * (typeGapValue * 18 + calcAttributeHeightOfGrid(span.id) + 18) // first 18px is margin between grids, second 18px is pane height.

  return gridHeight + descendantsMaxHeight
}

import _ from 'underscore'
import calcAttributeHeightOfGrid from './calcAttributeHeightOfGrid'

export default function getHeightIncludeDescendantGrids(span, typeContainer, typeGap) {
  const descendantsMaxHeight = span.children.length === 0 ? 0 :
    _.max(
      span.children.map(childSpan => getHeightIncludeDescendantGrids(childSpan, typeContainer, typeGap))
    )

  const typeGapHeight = 18
  const labelHegith = 18
  const entityPaneHeight = typeGap.showInstance ? 16 : 0
  const gridHeight = span.getTypes()
    .filter(type => !typeContainer.entity.isBlock(type.name))
    .length * (typeGap.value * typeGapHeight + labelHegith) + entityPaneHeight + calcAttributeHeightOfGrid(span.id)

  return gridHeight + descendantsMaxHeight
}

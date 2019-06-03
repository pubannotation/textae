import getHeightOfEntityPane from './getHeightOfEntityPane'
import calcAttributeHeightOfGrid from './calcAttributeHeightOfGrid'

const typeGapHeight = 18
const labelHegith = 18

export default function(span, typeContainer, typeGap) {
  const types = span.getTypes()
    .filter(type => !typeContainer.entity.isBlock(type.name))

  return types.length * (typeGap.value * typeGapHeight + labelHegith) + getHeightOfEntityPane(typeGap) + calcAttributeHeightOfGrid(types)
}

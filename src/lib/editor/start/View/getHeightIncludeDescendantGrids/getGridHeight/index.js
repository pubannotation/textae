import getAttributesHeight from './getAttributesHeight'
import getTypeUnitHeght from './getTypeUnitHeight'

export default function(span, typeGap) {
  const types = span.types.filter((type) => !type.isBlock)

  return types.length * getTypeUnitHeght(typeGap) + getAttributesHeight(types)
}

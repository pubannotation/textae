import getAttributesHeight from './getAttributesHeight'
import getTypeUnitHeght from './getTypeUnitHeight'

export default function(span, typeGap, annotationData) {
  const types = span.types.filter(
    (type) => !annotationData.entity.isBlock(type.name)
  )

  return types.length * getTypeUnitHeght(typeGap) + getAttributesHeight(types)
}

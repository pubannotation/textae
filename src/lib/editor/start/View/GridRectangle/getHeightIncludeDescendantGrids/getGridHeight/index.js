import getAttributesHeight from './getAttributesHeight'
import getTypeUnitHeght from './getTypeUnitHeight'

export default function (span, typeGap) {
  const entities = span.entities
  return (
    entities.length * getTypeUnitHeght(typeGap) + getAttributesHeight(entities)
  )
}

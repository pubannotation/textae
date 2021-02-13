import getAttributesHeight from './getAttributesHeight'
import getEntityUnitHeght from './getEntityUnitHeight'

export default function (span, typeGap) {
  const { entities } = span
  return (
    entities.length * getEntityUnitHeght(typeGap) +
    getAttributesHeight(entities)
  )
}

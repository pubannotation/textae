import getEntityUnitHeght from './getEntityUnitHeight'

export default function (span, typeGap) {
  const { entities } = span
  return (
    entities.length * getEntityUnitHeght(typeGap) +
    entities
      .map(({ attributesHeight }) => attributesHeight)
      .reduce((sum, heght) => sum + heght, 0)
  )
}

export default function (span, typeGap) {
  const { entities } = span
  return entities
    .map((entity) => entity.getHeight(typeGap))
    .reduce((sum, heght) => sum + heght, 0)
}

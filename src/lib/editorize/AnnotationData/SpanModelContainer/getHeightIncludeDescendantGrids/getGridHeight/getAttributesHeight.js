export default function getAttributesHeight(entities) {
  return entities
    .map((entity) => entity.attributesHeight)
    .reduce((sum, heght) => sum + heght, 0)
}

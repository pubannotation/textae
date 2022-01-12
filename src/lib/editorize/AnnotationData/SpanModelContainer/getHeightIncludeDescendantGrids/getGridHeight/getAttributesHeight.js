export default function getAttributesHeight(entities) {
  return entities
    .map(({ attributesHeight }) => attributesHeight)
    .reduce((sum, heght) => sum + heght, 0)
}

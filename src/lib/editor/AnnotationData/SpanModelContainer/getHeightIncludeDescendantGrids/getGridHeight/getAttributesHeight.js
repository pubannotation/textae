const attributeUnitHeght = 18

export default function getAttributesHeight(entities) {
  // The number of attributes for all entities of the same type is the same, as different attributes have different types.
  return entities
    .map((entity) => entity.attributes.length * attributeUnitHeght)
    .reduce((sum, heght) => sum + heght, 0)
}

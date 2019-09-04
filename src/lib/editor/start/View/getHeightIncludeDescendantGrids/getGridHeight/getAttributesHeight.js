const attributeUnitHeght = 18

export default function getAttributesHeight(types) {
  // The number of attributes for all entities of the same type is the same, as different attributes have different types.
  return types
    .map((type) => type.attributes.length * attributeUnitHeght)
    .reduce((sum, heght) => sum + heght, 0)
}

const attributeUnitHeght = 18

export default function getAttributesHeight(types) {
  return types.map(type => type.attributes.length * attributeUnitHeght).reduce((sum, heght) => sum + heght, 0)
}

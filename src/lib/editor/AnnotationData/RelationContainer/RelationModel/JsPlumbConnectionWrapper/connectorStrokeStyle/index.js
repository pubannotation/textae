import converseHEXinotRGBA from './converseHEXinotRGBA'

export default function (annotationData, typeDefinition, relation) {
  const { typeName } = relation
  const colorHex = typeDefinition.relation.getColor(typeName)

  return {
    strokeStyle: converseHEXinotRGBA(colorHex)
  }
}

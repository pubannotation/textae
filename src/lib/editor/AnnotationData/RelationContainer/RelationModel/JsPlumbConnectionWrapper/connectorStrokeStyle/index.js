import converseHEXinotRGBA from './converseHEXinotRGBA'

export default function (annotationData, typeDefinition, relation) {
  const { typeName } = annotationData.relation.get(relation.id)
  const colorHex = typeDefinition.relation.getColor(typeName)

  return {
    strokeStyle: converseHEXinotRGBA(colorHex)
  }
}

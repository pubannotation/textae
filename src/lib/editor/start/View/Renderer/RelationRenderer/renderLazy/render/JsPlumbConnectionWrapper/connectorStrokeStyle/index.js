import converseHEXinotRGBA from './converseHEXinotRGBA'

export default function (annotationData, typeDefinition, relationId) {
  const typeName = annotationData.relation.get(relationId).typeName
  const colorHex = typeDefinition.relation.getColor(typeName)

  return {
    strokeStyle: converseHEXinotRGBA(colorHex)
  }
}
